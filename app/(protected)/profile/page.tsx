import prisma from "@/prisma/prisma";
import { currentUser } from "@clerk/nextjs";

import ProfileActions from "./_components/ProfileActions";
import ProfileDetails from "./_components/ProfileDetails";
import ProfileEquipment from "./_components/ProfileEquipment";
import ProfileHero from "./_components/ProfileHero";
import ProfileMeasurements from "./_components/ProfileMeasurements";
import ProfileStats from "./_components/ProfileStats";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be signed in to view this page.");
  }

  const userId = user.id;
  const username = user?.username || undefined;
  const firstName = user?.firstName || undefined;
  const lastName = user?.lastName || undefined;
  const userImage = user?.imageUrl || undefined;

  const userMeasurements = await prisma.userInfo.findUnique({
    where: {
      userId: userId,
    },
    select: {
      age: true,
      height: true,
      weight: true,
    },
  });

  const equipmentObjects = await prisma.userEquipment.findMany({
    where: {
      userId: userId,
    },
    select: {
      equipmentType: true,
    },
  });

  const equipment = equipmentObjects.map(
    (obj: { equipmentType: string }) => obj.equipmentType,
  );

  return (
    <>
      <ProfileHero userImage={userImage} username={username} />
      {userMeasurements && <ProfileStats userMeasurements={userMeasurements} />}

      {/* <div className="flex justify-center py-2">
        <ThemeSwitcher />
      </div> */}

      <ProfileDetails
        username={username}
        firstName={firstName}
        lastName={lastName}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
        <ProfileMeasurements userMeasurements={userMeasurements} />
        <ProfileEquipment equipment={equipment} />
      </div>

      <ProfileActions />
    </>
  );
}
