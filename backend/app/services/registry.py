"""OneCompilerHub Backend - Centralized Language Registry.

Defines all 18 planned execution environments, distinguishing compiled,
interpreted, database query, browser preview, and framework-based tools.
All execution runtimes are marked unavailable / coming soon in Step 5.
"""

from typing import Dict, List, Optional
from app.core.constants import ExecutionMode, LanguageAvailability, ToolCategory
from app.schemas.language import LanguageEntry, ResourcePolicy

# Standard resource policy profiles
RESOURCE_POLICY_LIGHT = ResourcePolicy(
    id="policy_light",
    memory_limit_mb=64,
    cpu_limit_cores=0.5,
    max_timeout_seconds=5.0,
    network_enabled=False,
    pids_limit=32,
)

RESOURCE_POLICY_STANDARD = ResourcePolicy(
    id="policy_standard",
    memory_limit_mb=128,
    cpu_limit_cores=1.0,
    max_timeout_seconds=10.0,
    network_enabled=False,
    pids_limit=64,
)

RESOURCE_POLICY_COMPILED = ResourcePolicy(
    id="policy_compiled",
    memory_limit_mb=256,
    cpu_limit_cores=1.0,
    max_timeout_seconds=15.0,
    network_enabled=False,
    pids_limit=64,
)

RESOURCE_POLICY_HEAVY_JVM_DOTNET = ResourcePolicy(
    id="policy_heavy_runtime",
    memory_limit_mb=512,
    cpu_limit_cores=1.5,
    max_timeout_seconds=15.0,
    network_enabled=False,
    pids_limit=128,
)

RESOURCE_POLICY_DATABASE = ResourcePolicy(
    id="policy_isolated_database",
    memory_limit_mb=256,
    cpu_limit_cores=1.0,
    max_timeout_seconds=10.0,
    network_enabled=False,
    pids_limit=64,
)


class LanguageRegistryService:
    """Centralized registry for all supported developer tools and languages."""

    def __init__(self) -> None:
        self._languages: Dict[str, LanguageEntry] = {}
        self._register_default_tools()

    def _register_default_tools(self) -> None:
        raw_tools: List[LanguageEntry] = [
            LanguageEntry(
                id="html",
                display_name="HTML",
                category=ToolCategory.WEB,
                runtime_type="browser_v8",
                supported_file_extensions=[".html", ".htm"],
                default_file_name="index.html",
                execution_mode=ExecutionMode.BROWSER_PREVIEW,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_LIGHT,
                description="Client-side semantic HTML5 layout and web presentation.",
            ),
            LanguageEntry(
                id="python",
                display_name="Python",
                category=ToolCategory.PROGRAMMING,
                runtime_type="cpython_3.12",
                supported_file_extensions=[".py"],
                default_file_name="main.py",
                execution_mode=ExecutionMode.INTERPRETED,
                availability_status=LanguageAvailability.AVAILABLE,
                resource_policy=RESOURCE_POLICY_STANDARD,
                description="Interpreted high-level language for algorithms, scripting, and data analysis.",
            ),
            LanguageEntry(
                id="javascript",
                display_name="JavaScript",
                category=ToolCategory.WEB,
                runtime_type="v8_node_20",
                supported_file_extensions=[".js", ".mjs"],
                default_file_name="index.js",
                execution_mode=ExecutionMode.INTERPRETED,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_STANDARD,
                description="Universal ECMAScript runtime for modern web logic.",
            ),
            LanguageEntry(
                id="java",
                display_name="Java",
                category=ToolCategory.PROGRAMMING,
                runtime_type="openjdk_21",
                supported_file_extensions=[".java"],
                default_file_name="Main.java",
                execution_mode=ExecutionMode.COMPILED,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_HEAVY_JVM_DOTNET,
                description="Compiled, class-based object-oriented language running on the JVM.",
            ),
            LanguageEntry(
                id="mysql",
                display_name="MySQL",
                category=ToolCategory.DATABASE,
                runtime_type="mysql_8.0",
                supported_file_extensions=[".sql"],
                default_file_name="query.sql",
                execution_mode=ExecutionMode.DATABASE_QUERY,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_DATABASE,
                description="Relational database query runner with transactional isolation.",
            ),
            LanguageEntry(
                id="c",
                display_name="C",
                category=ToolCategory.PROGRAMMING,
                runtime_type="gcc_13",
                supported_file_extensions=[".c", ".h"],
                default_file_name="main.c",
                execution_mode=ExecutionMode.COMPILED,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_COMPILED,
                description="Procedural systems programming language with direct memory control.",
            ),
            LanguageEntry(
                id="cpp",
                display_name="C++",
                category=ToolCategory.PROGRAMMING,
                runtime_type="g++_13",
                supported_file_extensions=[".cpp", ".hpp", ".cc"],
                default_file_name="main.cpp",
                execution_mode=ExecutionMode.COMPILED,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_COMPILED,
                description="High-performance compiled language with object-oriented and generic features.",
            ),
            LanguageEntry(
                id="php",
                display_name="PHP",
                category=ToolCategory.WEB,
                runtime_type="php_8.3",
                supported_file_extensions=[".php"],
                default_file_name="index.php",
                execution_mode=ExecutionMode.INTERPRETED,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_STANDARD,
                description="Server-side scripting language designed for web page generation.",
            ),
            LanguageEntry(
                id="csharp",
                display_name="C#",
                category=ToolCategory.PROGRAMMING,
                runtime_type="dotnet_8.0",
                supported_file_extensions=[".cs"],
                default_file_name="Program.cs",
                execution_mode=ExecutionMode.COMPILED,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_HEAVY_JVM_DOTNET,
                description="Modern type-safe object-oriented language built on the .NET runtime.",
            ),
            LanguageEntry(
                id="fastapi",
                display_name="FastAPI",
                category=ToolCategory.FRAMEWORK,
                runtime_type="uvicorn_fastapi",
                supported_file_extensions=[".py"],
                default_file_name="app.py",
                execution_mode=ExecutionMode.FRAMEWORK,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_STANDARD,
                description="Asynchronous Python web framework for microservices and APIs.",
            ),
            LanguageEntry(
                id="lua",
                display_name="Lua",
                category=ToolCategory.PROGRAMMING,
                runtime_type="lua_5.4",
                supported_file_extensions=[".lua"],
                default_file_name="script.lua",
                execution_mode=ExecutionMode.INTERPRETED,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_LIGHT,
                description="Lightweight, ultra-fast embeddable scripting language.",
            ),
            LanguageEntry(
                id="plsql",
                display_name="PL/SQL",
                category=ToolCategory.DATABASE,
                runtime_type="oracle_compatible_sql",
                supported_file_extensions=[".sql"],
                default_file_name="block.sql",
                execution_mode=ExecutionMode.DATABASE_QUERY,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_DATABASE,
                description="Procedural SQL extension for database stored procedures and triggers.",
            ),
            LanguageEntry(
                id="nodejs",
                display_name="Node.js",
                category=ToolCategory.WEB,
                runtime_type="node_20_lts",
                supported_file_extensions=[".js", ".json"],
                default_file_name="server.js",
                execution_mode=ExecutionMode.INTERPRETED,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_STANDARD,
                description="Event-driven JavaScript backend runtime environment.",
            ),
            LanguageEntry(
                id="mongodb",
                display_name="MongoDB",
                category=ToolCategory.DATABASE,
                runtime_type="mongosh_7.0",
                supported_file_extensions=[".js", ".json"],
                default_file_name="queries.js",
                execution_mode=ExecutionMode.DATABASE_QUERY,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_DATABASE,
                description="Document-based NoSQL database query sandbox.",
            ),
            LanguageEntry(
                id="springboot",
                display_name="Spring Boot",
                category=ToolCategory.FRAMEWORK,
                runtime_type="spring_boot_3",
                supported_file_extensions=[".java"],
                default_file_name="Application.java",
                execution_mode=ExecutionMode.FRAMEWORK,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_HEAVY_JVM_DOTNET,
                description="Production-grade Java enterprise microservice framework.",
            ),
            LanguageEntry(
                id="react",
                display_name="React",
                category=ToolCategory.FRAMEWORK,
                runtime_type="react_18",
                supported_file_extensions=[".jsx", ".tsx", ".js"],
                default_file_name="App.jsx",
                execution_mode=ExecutionMode.BROWSER_PREVIEW,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_STANDARD,
                description="Declarative component-based UI library for frontend interactive web apps.",
            ),
            LanguageEntry(
                id="postgresql",
                display_name="PostgreSQL",
                category=ToolCategory.DATABASE,
                runtime_type="postgres_16",
                supported_file_extensions=[".sql"],
                default_file_name="query.sql",
                execution_mode=ExecutionMode.DATABASE_QUERY,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_DATABASE,
                description="Advanced open-source object-relational database query engine.",
            ),
            LanguageEntry(
                id="pygame",
                display_name="Pygame",
                category=ToolCategory.FRAMEWORK,
                runtime_type="python_pygame_wasm",
                supported_file_extensions=[".py"],
                default_file_name="game.py",
                execution_mode=ExecutionMode.FRAMEWORK,
                availability_status=LanguageAvailability.COMING_SOON,
                resource_policy=RESOURCE_POLICY_STANDARD,
                description="Python game programming multimedia framework.",
            ),
        ]

        for tool in raw_tools:
            self._languages[tool.id] = tool

    def get_all(self) -> List[LanguageEntry]:
        """Returns all 18 registered language environments."""
        return list(self._languages.values())

    def get_by_id(self, language_id: str) -> Optional[LanguageEntry]:
        """Looks up a language by its unique ID (case-insensitive)."""
        return self._languages.get(language_id.strip().lower())

    def is_supported(self, language_id: str) -> bool:
        """Checks if a language is in the registry."""
        return language_id.strip().lower() in self._languages


# Global registry singleton
language_registry = LanguageRegistryService()
