import * as React from "react";
import { useEffect, useState } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { UserEditar } from "@/pages/app/UsuarioEditar";
import { UserAtivo } from "@/pages/app/UsuarioStatus";
import GridLoader from "react-spinners/GridLoader";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export type UserCardProps = {
    id: number;
    nome: string;
    email: string;
    perfil: string;
    ativo: boolean;
};

// Função para mapear os perfis
const getPerfilDescription = (perfil?: string) => {
    if (!perfil) return "Desconhecido"; // Evita erro se for undefined/null

    const formattedPerfil = perfil.trim(); // Remove espaços extras

    switch (formattedPerfil) {
        case "Administrador":
            return "Administrador";
        case "Chefia":
        case 'Coordenação':
            return "Coordenação";
        case "Procurador":
            return "Procurador";
        case "Assessor":
            return "Assessor";
        case "Estagiario":
        case "Externo":
            return "Externo";
        default:
            return `Desconhecido (${formattedPerfil})`; // Exibe o valor real para facilitar debug
    }
};

export const columns: ColumnDef<UserCardProps>[] = [
    {
        accessorKey: "nome",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center gap-2"
                >
                    Nome
                    <ChevronDown className={`w-4 h-4 transition-transform ${column.getIsSorted() === "asc" ? "rotate-180" : ""}`} />
                </button>
            );
        },
        cell: ({ row }) => <div className="text-violet-800 font-semibold">{row.getValue("nome")}</div>,
        enableSorting: true,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "perfil",
        header: "Perfil",
        cell: ({ row }) => <div>{getPerfilDescription(row.getValue("perfil"))}</div>,
    },
    {
        accessorKey: "ativo",
        header: "Status",
        cell: ({ row }) => {
            const user = row.original;
            return <UserAtivo id={user.id} ativo={user.ativo} onStatusChange={() => { }} />;
        },
    },
    {
        id: "actions",
        header: "Ações",
        enableHiding: false,
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex gap-2">
                    <UserEditar user={user} />
                </div>
            );
        },
    },
];

export function UserCard() {
    const [users, setUsers] = useState<UserCardProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    useEffect(() => {
        const loadUserCard = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await api.get("/list_users", {
                    params: { limite: 1000 },
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Mapeia os usuários e converte o perfil antes de salvar no estado
                const mappedUsers = response.data.map((user: UserCardProps) => ({
                    ...user,
                    perfil: getPerfilDescription(user.perfil), // Mapeia o perfil aqui
                }));

                setUsers(mappedUsers);
            } catch (error) {
                console.error("Erro ao carregar usuários:", error);
            } finally {
                setLoading(false);
            }
        };
        loadUserCard();
    }, []);

    const table = useReactTable({
        data: users,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    return (
        <div className="w-full">
            {loading && (
                <div className="flex justify-center items-center h-screen">
                    <GridLoader size={16} color="#9655eb" />
                </div>
            )}
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filtrar por nome..."
                    value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("nome")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Colunas <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Nenhum resultado encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-start mt-3 mb-2">
                <Pagination className="bottom-0 dark:bg-transparent py-2 cursor-pointer">
                    <PaginationContent>
                        <PaginationPrevious onClick={() => table.previousPage()}>Página Anterior</PaginationPrevious>
                        <PaginationItem>Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}</PaginationItem>
                        <PaginationNext onClick={() => table.nextPage()}>Próxima Página</PaginationNext>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
