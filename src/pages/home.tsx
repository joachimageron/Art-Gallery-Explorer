import { Link } from "@heroui/link";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Welcome to&nbsp;</h1>
          <h1 className={title({ color: "violet" })}>Art Gallery Explorer</h1>
        </div>

        <div className="flex gap-3">
          <Link href="/test">
            <Button color="primary" radius="full" variant="shadow">
              Test API page
            </Button>
          </Link>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 transition-transform duration-300 ease-in-out hover:scale-105">
        <Image
          isBlurred
          alt="random image from picsum"
          src="https://picsum.photos/200/300"
          width={200}
          height={300}
        />
      </section>
    </DefaultLayout>
  );
}
