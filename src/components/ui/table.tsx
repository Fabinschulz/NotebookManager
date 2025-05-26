'use client';

import * as React from 'react';

import { cn } from '@/utils';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Button } from './button';
import { Input } from './input';

function TableRoot({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div data-testid="table-container" className="relative w-full overflow-x-auto rounded border border-gray-300">
      <table data-testid="table" className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead data-testid="table-header" className={cn('[&_tr]:border-b [&_tr]:border-gray-300', className)} {...props} />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody data-testid="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-testid="table-footer"
      className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-testid="table-row"
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b border-b-gray-300 transition-colors',
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-testid="table-head"
      className={cn(
        'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-testid="table-cell"
      className={cn(
        'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  );
}

interface Header {
  field: string;
  label: string;
}

interface TableProps {
  title?: string;
  headers: Header[];
  data: Record<string, any>[];
  itemsPerPage?: number;
  searchableFields?: string[];
  searchPlaceholder?: string;
}

const Table: React.FC<TableProps> = ({
  title,
  headers,
  data,
  itemsPerPage = 5,
  searchableFields = [],
  searchPlaceholder = 'Buscar...'
}) => {
  const [search, setSearch] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredData = React.useMemo(() => {
    if (!search) return data;

    return data.filter((item) =>
      searchableFields.some((field) => String(item[field]).toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, data, searchableFields]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      {(title || searchableFields.length > 0) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {title && <h3 className="text-2xl font-semibold text-primary">{title}</h3>}
          {searchableFields.length > 0 && (
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={handleSearch}
              className="sm:w-1/4"
            />
          )}
        </div>
      )}

      <ScrollArea className="w-full">
        <TableRoot>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header.field}>{header.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, idx) => (
              <TableRow key={idx}>
                {headers.map((header) => (
                  <TableCell key={header.field}>{String(item[header.field] ?? '—')}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </ScrollArea>
      <TableFooter>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              type="button"
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              type="button"
            >
              Próximo
            </Button>
          </div>
        )}
      </TableFooter>
    </div>
  );
};

export { Table };
