import { Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import relativeTime from 'dayjs/plugin/relativeTime';
import { IconButton } from './icon-button';
import { Table } from './table/table';
import { TableHeader } from './table/table-header';
import { TableData } from './table/table-data';
import { TableRow } from './table/table-row';
import { ChangeEvent, useEffect, useState } from 'react';


dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
    id: string
    name: string
    email: string
    createdAt: string
    checkedInAt: string | null
}

export function AttendeeList() {
    const [search, setSearch] = useState(() => {
        const url = new URL(window.location.toString())
        if (url.searchParams.has('search')) {
            return url.searchParams.get('search') ?? ''
        }
        return ''
    })
    const [page, setPage] = useState(() => {
        const url = new URL(window.location.toString())
        if (url.searchParams.has('page')) {
            return Number(url.searchParams.get('page'))
        }
        return 1
    })


    const [attendees, setAttendees] = useState<Attendee[]>([])
    const [total, setTotal] = useState(0)

    const totalPage = Math.ceil(total / 10)

    useEffect(() => {
        const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')
        url.searchParams.set('pageIndex', String(page - 1))
        if (search.length > 0) {
            url.searchParams.set('query', search)
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setAttendees(data.attendees)
                setTotal(data.total)
            })
    }, [page, search])

    function setCurrentSearch(search: string) {
        const url = new URL(window.location.toString())
        url.searchParams.set('search', search)
        window.history.pushState({}, "", url)
        setSearch(search)
    }

    function setCurrentPage(page: number) {
        const url = new URL(window.location.toString())
        url.searchParams.set('page', String(page))
        window.history.pushState({}, "", url)
        setPage(page)
    }
    function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
        setCurrentSearch(event.target.value)
        setCurrentPage(1)
    }
    function goToFirtsPage() {
        setCurrentPage(1)
    }
    function goToNextPage() {
        setCurrentPage(page + 1)
    }
    function goToPreviousPage() {
        setCurrentPage(page - 1)
    }
    function goToLastPage() {
        setCurrentPage(totalPage)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bold">Participantes</h1>
                <div className="px-2 w-72 h-10 py-2 border border-white/10  rounded-lg text-sm flex items-center gap-3">
                    <Search className="size-4 text-emerald-300" />
                    <input
                        onChange={onSearchInputChanged}
                        value={search}
                        className="flex-1 h-6 bg-transparent border-0 p-0 outline-none text-sn focus:ring-0"
                        placeholder="Buscar participantes..." />
                </div>
            </div>
            <Table>
                <thead>
                    <tr className="border border-white/10">
                        <TableHeader style={{ width: 48 }}>
                            <input type="checkbox" className="size-4 bg-black/20 rounded border border-white/10" />
                        </TableHeader>
                        <TableHeader >Código</TableHeader>
                        <TableHeader >Participantes</TableHeader>
                        <TableHeader >Data de Inscrição</TableHeader>
                        <TableHeader >Data de check-in</TableHeader>
                        <TableHeader style={{ width: 64 }} ></TableHeader>
                    </tr>
                </thead>
                <tbody className="text-left">
                    {attendees.map((attendees) => {
                        return (
                            <TableRow key={attendees.id}>
                                <TableData>
                                    <input type="checkbox" className="size-4 bg-black/20 rounded border border-white/10" />
                                </TableData>
                                <TableData>{attendees.id}</TableData>
                                <TableData>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-white">{attendees.name}</span>
                                        <span>{attendees.email}</span>
                                    </div>
                                </TableData>
                                <TableData>{dayjs().to(attendees.createdAt)}</TableData>
                                <TableData>
                                    {attendees.checkedInAt === null
                                        ? <span className="text-zinc-400">Não fez check-in</span>
                                        : dayjs().to(attendees.checkedInAt)}</TableData>
                                <TableData>
                                    <IconButton transparent>
                                        <MoreHorizontal className="size-4" />
                                    </IconButton>
                                </TableData>
                            </TableRow>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <TableData colSpan={3}>Mostrando {attendees.length} de {total} itens</TableData>
                        <TableData className="text-right" colSpan={3}>
                            <div className="inline-flex items-center gap-8 text-left">
                                <span>Página {page} de {totalPage}</span>
                                <div className="flex gap-1.5">
                                    <IconButton onClick={goToFirtsPage} disabled={page === 1}>
                                        <ChevronsLeft className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                                        <ChevronLeft className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToNextPage} disabled={page === totalPage}>
                                        <ChevronRight className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToLastPage} disabled={page === totalPage}>
                                        <ChevronsRight className="size-4" />
                                    </IconButton>
                                </div>
                            </div>
                        </TableData>
                    </tr>
                </tfoot>
            </Table>
        </div >
    )
}