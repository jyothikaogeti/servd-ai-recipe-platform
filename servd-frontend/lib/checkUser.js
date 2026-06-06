import { auth, currentUser } from "@clerk/nextjs/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function checkUser() {
  const user = await currentUser();

  if (!user) {
    console.log("No User Found");
    return null;
  }

  if (!STRAPI_API_TOKEN) {
    console.log("STRAPI_API_TOKEN is missing in .env");
    return null;
  }

  // Check If User has PRO Plan
  const { has } = await auth();
  const subscriptionTier = has({ plan: "pro_user" }) ? "pro" : "free";

  try {
    // Check If User Exists in Strapi
    const existingUserResponse = await fetch(
      `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!existingUserResponse.ok) {
      const errorText = await existingUserResponse.text();
      console.error("Strapi Error Response:", errorText);
      return null;
    }

    const existingUserData = await existingUserResponse.json();

    if (existingUserData.length > 0) {
      const existingUser = existingUserData[0];

      if (existingUser.subscriptionTier !== subscriptionTier) {
        await fetch(`${STRAPI_URL}/api/users/${existingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify({ subscriptionTier }),
        });
      }
      return { ...existingUser, subscriptionTier };
    }

    const rolesResponse = await fetch(
      `${STRAPI_URL}/api/users-permissions/roles`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
      },
    );

    const rolesData = await rolesResponse.json();
    const authenticatedRole = rolesData.roles.find(
      (role) => role.type === "authenticated",
    );

    if (!authenticatedRole) {
      console.error("Authenticated Role not found");
    }

    // Create New User
    const userData = {
      username:
        user.username || user.emailAddresses[0].emailAddress.split("@")[0],
      email: user.emailAddresses[0].emailAddress,
      password: `clerk_managed_${user.id}_${Date.now()}`,
      confirmed: true,
      blocked: false,
      role: authenticatedRole.id,
      clerkId: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      imageUrl: user.imageUrl || "",
      subscriptionTier,
    };

    const newUserResponse = await fetch(`${STRAPI_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(userData),
    });

    if (!newUserResponse.ok) {
      const errorText = await newUserResponse.text();
      console.error("Error Creating User:", errorText);
      return null;
    }

    const newUser = await newUserResponse.json();
    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error.message);
    return null;
  }
}
