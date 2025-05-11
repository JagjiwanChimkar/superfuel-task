import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { title } from "@/config.shared";
import JsCodeSnippet, { JsCodeSnippetModel } from "@/models/menu-item";
import { LoaderFunction, type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";
export const meta: MetaFunction = () => {
  return [
    { title: title() },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async (): Promise<JsCodeSnippet[]> => {
  return JsCodeSnippetModel.find().lean() ?? [];
};

export default function Index() {
  const snippets = useLoaderData<JsCodeSnippet[]>();
  const navigate = useNavigate();

  return (
    <main className="container py-2">
      <Button onClick={() => navigate("/new")}>Add New Code</Button>

      {snippets?.length === 0 ? (
        <p className="my-2">Empty</p>
      ) : (
        <div className="flex flex-col gap-2 my-2">
          {snippets?.map((snippet) => (
            <Card key={snippet._id}>
              <CardHeader>
                <CardTitle>Name: {snippet.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Label className="font-bold">Snippet: </Label>
                <p>{snippet.code}</p>
                <Button onClick={() => navigate(`/execute/${snippet._id}`)}>
                  Run
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
