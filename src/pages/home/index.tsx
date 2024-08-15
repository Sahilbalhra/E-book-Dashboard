import { CreditCard, Users, Package2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TopUser } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/api/apiCore";

const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
    staleTime: 10000,
  });
  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex min-h-screen w-full flex-col">
          {isLoading ? (
            <h4>Loading...</h4>
          ) : (
            <main className="flex flex-1 flex-col gap-4 md:gap-6">
              <div className="grid gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
                <Card x-chunk="dashboard-01-chunk-0">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Books
                    </CardTitle>
                    <Package2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {data?.data?.data?.totalBooks || "0"}
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {data?.data?.data?.totalUsers || "0"}
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Reviews
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {" "}
                      {data?.data?.data?.totalReviews || "0"}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card className="mt-6 overflow-auto">
                <CardHeader>
                  <CardTitle>Top Reviewers</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reviewer</TableHead>
                        <TableHead>Total Reviewed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(data?.data?.data?.topUsers) &&
                        data?.data?.data?.topUsers.map((user: TopUser) => {
                          return (
                            <TableRow key={user.user_id}>
                              <TableCell>
                                <div className="flex items-center gap-4">
                                  <Avatar className="hidden h-9 w-9 sm:flex">
                                    <AvatarFallback>
                                      {String(user.name).slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="grid gap-1">
                                    <p className="text-sm font-medium leading-none">
                                      {user.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {" "}
                                <Badge variant="outline">
                                  {" "}
                                  {user.reviewCount}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </main>
          )}
        </div>
      </main>
    </>
  );
};

export default HomePage;
