import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Footer() {
  return (
    <div className="w-full flex itmes-center justify-end">
      <Link href='/feedback'><Button variant="link">Give us feedback</Button></Link>
    </div>
  )
}
