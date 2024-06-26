import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { createBookApi, getBookByIdApi, updateBookApi } from "@/api/apiCore";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  genre: z.string().min(2, {
    message: "Genre must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  cover_image: z.instanceof(FileList).refine((file) => {
    return file.length == 1;
  }, "Cover Image is required"),
  file: z.instanceof(FileList).refine((file) => {
    return file.length == 1;
  }, "Book PDF is required"),
});

const CreateBook = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { data } = useQuery({
    queryKey: ["book"],
    queryFn: async () => await getBookByIdApi(state?.id),
    staleTime: 10000,
    enabled: !!state?.id,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      genre: "",
      description: "",
    },
  });

  const coverImageRef = form.register("cover_image");
  const fileRef = form.register("file");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBookApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });

      navigate("/dashboard/books");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateBookApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });

      navigate("/dashboard/books");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const formdata = new FormData();
    formdata.append("title", values.title);
    formdata.append("genre", values.genre);
    formdata.append("description", values.description);
    formdata.append("cover_image", values.cover_image[0]);
    formdata.append("file", values.file[0]);
    if (state?.id) {
      formdata.append("_id", state?.id);
      updateMutation.mutate(formdata);
    } else {
      mutation.mutate(formdata);
    }
  }

  useEffect(() => {
    if (data?.data?.data) {
      form.reset({
        title: data?.data?.data?.title,
        genre: data?.data?.data?.genre,
        description: data?.data?.data?.description,
      });
    }
  }, [data?.data?.data]);

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/books">Books</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {state?.id ? "Update" : "Create"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-4">
              <Link to="/dashboard/books">
                <Button variant={"outline"}>
                  <span className="ml-2">Cancel</span>
                </Button>
              </Link>
              <Button type="submit" disabled={mutation.isPending}>
                {(mutation.isPending || updateMutation.isPending) && (
                  <LoaderCircle className="animate-spin" />
                )}
                <span className="ml-2">{state?.id ? "Update" : "Create"}</span>
              </Button>
            </div>
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                {" "}
                {state?.id ? "Update" : "Create a new "} Create a new book
              </CardTitle>
              <CardDescription>
                Fill out the form below to{" "}
                {state?.id ? "update" : "create a new "} book.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-32" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cover_image"
                  render={() => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          className="w-full"
                          {...coverImageRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>Book File</FormLabel>
                      <FormControl>
                        <Input type="file" className="w-full" {...fileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </section>
  );
};

export default CreateBook;
