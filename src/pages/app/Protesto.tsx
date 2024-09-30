import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Helmet } from 'react-helmet-async';

export function Protesto() {
    return (
        <>
        <Helmet title="Protesto" />
        <div className='flex flex-col gap-4'>
            <h1 className='text-2xl font-bold text-slate-700'>Protesto</h1>
        </div>
        <div className='space-y-2.5'>
            <form className='flex items-center gap-2 mt-2'>
                <span className='text-sm font-semibold'>Filtros:</span>
                <Input placeholder='CNPJ' className='w-[320px]' />
            </form>

            <div className='border rounded-md'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>CNPJ</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>último histórico</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Button variant='outline' size='xs'></Button>
                            </TableCell>
                            <TableCell>00.000.000/0001-91</TableCell>
                            <TableCell>123.456.789-00</TableCell>
                            <TableCell>Nome do Protesto</TableCell>
                            <TableCell>Data do último Histórico</TableCell>
                        </TableRow>
                    </TableBody>


                </Table>

            </div>
        </div>
        </>
    )
}