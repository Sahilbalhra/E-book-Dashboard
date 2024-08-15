import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReviewsByBookIdApi,
  getBooksApi,
  deleteReviewApi,
} from "@/api/apiCore";
import { Book, Review } from "@/types";
import NoBookFound from "/no_book_found.webp";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import DeleteConfirmationModal from "@/components/generalUi/DeleteConfirmationModal";

const Reviews = () => {
  const [currentSelectedBook, setCurrentSelectedBook] = useState<string | null>(
    null
  );

  const queryClient = useQueryClient();
  const {
    data: reviewsApiData,
    isLoading: isReviewApiLoading,
    isError: isReviewApiError,
  } = useQuery({
    queryKey: [`book-reviews-${currentSelectedBook}`, currentSelectedBook],
    queryFn: async () => await getReviewsByBookIdApi(currentSelectedBook),
    staleTime: 10000,
    enabled: !!currentSelectedBook,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["books"],
    queryFn: getBooksApi,
    staleTime: 10000,
  });

  const mutation = useMutation({
    mutationFn: deleteReviewApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`book-reviews-${currentSelectedBook}`, currentSelectedBook],
      });
    },
  });

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Reviews</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <Select
          onValueChange={(e) => {
            setCurrentSelectedBook(e);
          }}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Book" />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(data?.data?.data) && data?.data?.data.length > 0
              ? data?.data?.data.map((book: Book) => (
                  <SelectItem value={book._id} key={book._id}>
                    {book.title}
                  </SelectItem>
                ))
              : null}
          </SelectContent>
        </Select>
        {!isLoading &&
        !isError &&
        (!data?.data?.data ||
          (Array.isArray(data?.data?.data) &&
            data?.data?.data.length === 0)) ? (
          <div className="my-4 border rounded-lg overflow-hidden shadow-lg">
            <img
              src={NoBookFound}
              alt="No Book Found"
              className="h-[450px] w-full object-center"
            />
          </div>
        ) : null}

        {!currentSelectedBook ? (
          <h6 className="text-center my-20  font-black text-gray-700">
            Pick a book to explore its reviews and dive into the story before
            you start reading!
          </h6>
        ) : null}
      </div>

      {isReviewApiLoading && !isReviewApiError ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="flex items-center justify-center">
            <CirclePlus size={100} />
          </div>
          <div className="mt-4">
            <h1 className="text-xl font-semibold">Loading...</h1>
          </div>
        </div>
      ) : Array.isArray(reviewsApiData?.data?.data?.reviews) ? (
        <Card className="mt-6 overflow-auto">
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>View your books reviews.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Title</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewsApiData?.data?.data?.reviews.map((review: Review) => {
                  return (
                    <TableRow key={review._id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarFallback>
                              {String(review.user_id.name).slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">
                              {review.user_id.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {review.user_id.email || ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium hidden md:table-cell">
                        {review.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{review.rating}</Badge>
                      </TableCell>
                      <TableCell>{review.comment}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="text-red-400 border-red-500 hover:text-red-500 hover:border-red-600 hover:bg-red-50"
                            >
                              {" "}
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DeleteConfirmationModal />
                            <DialogFooter className="justify-between">
                              <DialogClose asChild>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="my-2"
                                >
                                  Close
                                </Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  type="button"
                                  variant={"default"}
                                  className="my-2"
                                  disabled={mutation.isPending}
                                  onClick={() => {
                                    mutation.mutate(review._id);
                                  }}
                                >
                                  Yes Sure !
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
};

export default Reviews;
