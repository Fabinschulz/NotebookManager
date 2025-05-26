import { cn } from '@/utils';
import Link from 'next/link';
import * as React from 'react';

interface CardProps extends React.ComponentProps<'div'> {
  datatestId?: string;
}

function Card({ className, id, datatestId, ...props }: CardProps) {
  return (
    <div
      data-testid={datatestId ?? `card-${id}`}
      id={id}
      className={cn(
        `
        bg-card 
        text-card-foreground 
        flex flex-col gap-6 
        rounded-xl 
        border border-gray-300
        py-6 
        shadow-sm`,
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-testid="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-testid="card-title" className={cn('leading-none font-semibold', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-testid="card-description" className={cn('text-muted-foreground text-sm', className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-testid="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-testid="card-content" className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-testid="card-footer" className={cn('flex items-center px-6 [.border-t]:pt-6', className)} {...props} />
  );
}

interface CardLinkProps {
  title: string;
  link: string;
  icon: React.ReactNode;
}

function CardLink({ title, link, icon }: CardLinkProps) {
  return (
    <Link href={link} className="text-decoration-none">
      <Card
        className={`
        bg-white
          w-80 h-48 md:w-[400px] md:h-[260px]
          flex items-center justify-center text-center
          p-4
          transition-transform duration-200
          hover:-translate-y-1 hover:shadow-lg
        `}
      >
        <CardContent className={`flex flex-col items-center justify-center h-full text-[#006e89]`}>
          {icon}
          <h1
            className={`
              text-lg font-semibold
              mt-4
              lg:text-2xl
              sm:text-xl
              text-center
            `}
          >
            {title}
          </h1>
        </CardContent>
      </Card>
    </Link>
  );
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardLink, CardTitle };

