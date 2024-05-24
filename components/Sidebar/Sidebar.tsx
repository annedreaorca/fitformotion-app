import { currentUser } from "@clerk/nextjs";
import SidebarBrand from "./SidebarBrand";
import SidebarNav from "./SidebarNav";
//import SidebarWorkoutControls from "./SidebarWorkoutControls";
import SidebarUser from "./SidebarUser";
//import SidebarSearch from "./SidebarSearch";
//import SidebarSocials from "./SidebarSocials";
import SidebarWrapper from "./SidebarWrapper.client";

export default async function Sidebar() {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be signed in to view this page.");
  }

  const username = user?.username || undefined;
  const userImage = user?.imageUrl;

  return (
    <SidebarWrapper>
      <SidebarBrand />
      <SidebarUser username={username} userImage={userImage} />
      {/* <SidebarSearch /> */}
      <SidebarNav />
      {/* <SidebarWorkoutControls /> */}
    </SidebarWrapper>
  );
}
