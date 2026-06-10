import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type PlaceholderPageProps = {
  description: string;
  title: string;
};

export function PlaceholderPage({ description, title }: PlaceholderPageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-edren-text-muted">
          Esta area ja esta na navegacao e sera implementada nas proximas fatias do MVP.
        </p>
      </CardContent>
    </Card>
  );
}
