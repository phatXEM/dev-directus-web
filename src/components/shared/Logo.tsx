import Image from "next/image";
import { Link } from "@/i18n/routing";

const Logo = () => {
  return (
    <Link href="/home">
      <Image
        src="/images/soc-logo.png"
        alt="logo"
        className="w-auto h-auto"
        width={200}
        height={100}
        priority
      />
    </Link>
  );
};

export default Logo;
