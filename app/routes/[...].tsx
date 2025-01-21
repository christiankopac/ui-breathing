import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  return new Response("Not Found", { status: 404 });
};

export default function CatchAll() {
  return <div>Not Found</div>;
}