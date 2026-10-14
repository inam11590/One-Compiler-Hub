/**
 * OneCompilerHub - Zero-Dependency Client-Side ZIP Generator
 * Generates valid standard PKZIP (.zip) archives natively in TypeScript/JavaScript.
 * Supports exporting HTML, CSS, JS, and project assets for offline browser execution.
 */

// CRC-32 Lookup Table
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[i] = c >>> 0;
}

function calculateCRC32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export interface ZipFileEntry {
  name: string;
  content: string | Uint8Array;
}

/**
 * Creates a valid PKZIP binary Uint8Array from a list of files.
 */
export function createZipArchive(files: ZipFileEntry[]): Uint8Array {
  const encoder = new TextEncoder();
  const fileRecords: {
    nameBytes: Uint8Array;
    contentBytes: Uint8Array;
    crc32: number;
    offset: number;
    dosTime: number;
    dosDate: number;
  }[] = [];

  const now = new Date();
  const dosTime =
    ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff;
  const dosDate =
    (((now.getFullYear() - 1980) << 9) |
      ((now.getMonth() + 1) << 5) |
      now.getDate()) &
    0xffff;

  let totalSize = 0;

  // Process and calculate size
  for (const file of files) {
    // Sanitize filename: remove leading slashes and prevent directory traversal
    const cleanName = file.name.replace(/^\/+/, "").replace(/\.\./g, "");
    const nameBytes = encoder.encode(cleanName);
    const contentBytes =
      typeof file.content === "string"
        ? encoder.encode(file.content)
        : file.content;

    const crc = calculateCRC32(contentBytes);

    fileRecords.push({
      nameBytes,
      contentBytes,
      crc32: crc,
      offset: 0,
      dosTime,
      dosDate,
    });

    // Local Header: 30 bytes + name length + content length
    totalSize += 30 + nameBytes.length + contentBytes.length;
  }

  let centralDirSize = 0;
  for (const record of fileRecords) {
    // Central Dir Header: 46 bytes + name length
    centralDirSize += 46 + record.nameBytes.length;
  }

  // End of Central Directory Header: 22 bytes
  totalSize += centralDirSize + 22;

  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);
  let cursor = 0;

  // 1. Write Local File Headers & Data
  for (const record of fileRecords) {
    record.offset = cursor;

    // Local file header signature (0x04034b50)
    view.setUint32(cursor, 0x04034b50, true);
    view.setUint16(cursor + 4, 20, true); // Version needed (2.0)
    view.setUint16(cursor + 6, 0x0800, true); // UTF-8 filename flag
    view.setUint16(cursor + 8, 0, true); // Compression method: 0 (Stored/No compression)
    view.setUint16(cursor + 10, record.dosTime, true);
    view.setUint16(cursor + 12, record.dosDate, true);
    view.setUint32(cursor + 14, record.crc32, true);
    view.setUint32(cursor + 18, record.contentBytes.length, true); // Compressed size
    view.setUint32(cursor + 22, record.contentBytes.length, true); // Uncompressed size
    view.setUint16(cursor + 26, record.nameBytes.length, true);
    view.setUint16(cursor + 28, 0, true); // Extra field length

    cursor += 30;
    buffer.set(record.nameBytes, cursor);
    cursor += record.nameBytes.length;

    buffer.set(record.contentBytes, cursor);
    cursor += record.contentBytes.length;
  }

  const centralDirOffset = cursor;

  // 2. Write Central Directory Headers
  for (const record of fileRecords) {
    // Central directory header signature (0x02014b50)
    view.setUint32(cursor, 0x02014b50, true);
    view.setUint16(cursor + 4, 20, true); // Version made by (2.0)
    view.setUint16(cursor + 6, 20, true); // Version needed (2.0)
    view.setUint16(cursor + 8, 0x0800, true); // UTF-8 flag
    view.setUint16(cursor + 10, 0, true); // Compression: Stored
    view.setUint16(cursor + 12, record.dosTime, true);
    view.setUint16(cursor + 14, record.dosDate, true);
    view.setUint32(cursor + 16, record.crc32, true);
    view.setUint32(cursor + 20, record.contentBytes.length, true);
    view.setUint32(cursor + 24, record.contentBytes.length, true);
    view.setUint16(cursor + 28, record.nameBytes.length, true);
    view.setUint16(cursor + 30, 0, true); // Extra field length
    view.setUint16(cursor + 32, 0, true); // Comment length
    view.setUint16(cursor + 34, 0, true); // Disk number start
    view.setUint16(cursor + 36, 0, true); // Internal file attributes
    view.setUint32(cursor + 38, 0, true); // External file attributes
    view.setUint32(cursor + 42, record.offset, true); // Relative offset of local header

    cursor += 46;
    buffer.set(record.nameBytes, cursor);
    cursor += record.nameBytes.length;
  }

  // 3. Write End of Central Directory Record (EOCD)
  view.setUint32(cursor, 0x06054b50, true); // Signature
  view.setUint16(cursor + 4, 0, true); // Disk number
  view.setUint16(cursor + 6, 0, true); // Disk with central dir
  view.setUint16(cursor + 8, fileRecords.length, true); // Total entries this disk
  view.setUint16(cursor + 10, fileRecords.length, true); // Total entries
  view.setUint32(cursor + 12, centralDirSize, true); // Central dir size
  view.setUint32(cursor + 16, centralDirOffset, true); // Offset of central dir
  view.setUint16(cursor + 20, 0, true); // Comment length

  return buffer;
}

/**
 * Triggers a browser download of a generated file or ZIP archive.
 */
export function downloadFile(
  content: string | Uint8Array,
  filename: string,
  mimeType: string
): void {
  if (typeof window === "undefined") return;

  const blob =
    typeof content === "string"
      ? new Blob([content], { type: mimeType })
      : new Blob([content.buffer as ArrayBuffer], { type: mimeType });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
