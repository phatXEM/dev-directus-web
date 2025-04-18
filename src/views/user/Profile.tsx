"use client";

import { Center, Container } from "@mantine/core";
import ProfileForm from "@/components/user/profile/ProfileForm";

const Profile = () => {
  return (
    <Container fluid mx={0}>
      <Center>
        <ProfileForm />
      </Center>
    </Container>
  );
};

export default Profile;
