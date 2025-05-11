import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { executeCode } from "@/entry.server";
import JsCodeSnippet, { JsCodeSnippetModel } from "@/models/js-code-snippets";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

interface LoaderData {
  snippet: JsCodeSnippet | null;
  executionResult: {
    success: boolean;
    result: any;
    error: string | null;
  } | null;
}

export const loader = async ({ params }: { params: { id: string } }) => {
  const codeSnippetFile = await JsCodeSnippetModel.findById(params.id);
  if (!codeSnippetFile) {
    return json<LoaderData>({ snippet: null, executionResult: null });
  }

  const executionResult = await executeCode(codeSnippetFile.code);
  return json<LoaderData>({ snippet: codeSnippetFile, executionResult });
};

const CodeRunner = () => {
  const { snippet, executionResult } = useLoaderData<LoaderData>();

  if (!snippet) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Code snippet not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container py-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{snippet.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-bold">Code:</Label>
            <pre className="mt-2 p-4 bg-muted rounded-lg overflow-x-auto">
              <code>{snippet.code}</code>
            </pre>
          </div>

          {executionResult && (
            <div>
              <Label className="font-bold">Execution Result:</Label>
              {executionResult.success ? (
                <Alert className="mt-2">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    <pre className="mt-2 p-4 bg-muted rounded-lg overflow-x-auto">
                      {JSON.stringify(executionResult.result, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive" className="mt-2">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{executionResult.error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeRunner;
