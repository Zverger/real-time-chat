import { LoadingLogo } from "@/components/shared";
import { Button } from "@/components/ui";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <Button>Hello</Button>
      <UserButton />
    </>
  );
}
