import LocationCard from "./components/location";
import NavBar from "../components/navBar";
import { db } from "../../drizzle";
import { location } from "../../drizzle/schema";

export default async function Places() {
  const locations = await db
    .select({
      id: location.id,
      name: location.name,
      coverUrl: location.coverUrl,
    })
    .from(location);

  return (
    <div className="flex flex-col items-center justify-between w-full h-auto">
      <NavBar>
        <span className="text-sm">
          Places you might&nbsp;
          <span className="text-primary">Like</span>
        </span>
      </NavBar>
      <div className="flex flex-col flex-wrap items-center w-full h-full gap-8 p-8 sm:h-auto sm:flex-row justify-evenly sm:justify-start sm:gap-12">
        {locations.map((location) => (
          <LocationCard location={location} key={location.id} />
        ))}
      </div>
      <h4 className="py-8">
        More places to be added once we&apos;re{" "}
        <span className="text-yellow-400">rich</span>.
      </h4>
    </div>
  );
}
