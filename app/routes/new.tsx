import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JsCodeSnippetModel } from "@/models/menu-item";
import { Form, redirect, useNavigate } from "@remix-run/react";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const newCodeForm = Object.fromEntries(formData);
  await JsCodeSnippetModel.create({ ...newCodeForm });
  return redirect("/");
};

const NewCode = () => {
  const navigate = useNavigate();

  return (
    <div className="p-3">
      <h2>Add Code</h2>
      <Form method="post">
        <div className="flex flex-col gap-y-4 ">
          <div>
            <Label>Name</Label>
            <Input name="name" placeholder="Code Snippet name" type="text" />
          </div>

          <div>
            <Label>Code</Label>
            <Textarea name="code" placeholder="Code Snippet" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="my-2" type="submit">
            Add
          </Button>
          <Button
            variant={"outline"}
            className="my-2"
            type="submit"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewCode;
