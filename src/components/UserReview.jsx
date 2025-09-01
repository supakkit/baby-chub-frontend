import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function UserReview() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <div className="grid gap-2">
          <Textarea
            placeholder="Write your review..."
            className="resize-none rounded-md border border-input bg-background p-3 text-sm shadow-sm"
          />
          <Button className="justify-center">Submit</Button>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div className="grid gap-1.5">
            <div className="flex items-center gap-2">
              <div className="font-medium">สุชาครีย์</div>
              <div className="text-xs text-muted-foreground">2 days ago</div>
            </div>
            <div className="text-sm text-muted-foreground">ของดี เวรี่กู๊ด</div>
          </div>
        </div>
      </div>
    </div>
  );
}
