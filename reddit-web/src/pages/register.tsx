import { useFormik } from "formik";
import {
  Box,
  Container,
  Heading,
  Image,
  Text,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Button,
} from "@chakra-ui/react";

export default function Register({}) {
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      name: "",
      bio: "",
    },
    onSubmit: (values) => console.log("values :>> ", values),
  });
  return (
    <Container
      height="100vh"
      maxW="full"
      padding={0}
      display="flex"
      gap={"2rem"}
    >
      <Box height={"100vh"}>
        <Image
          src="/assets/register-banner.png"
          alt="Register Banner"
          borderRadius={0}
          height="full"
          objectFit={"cover"}
        />
      </Box>
      <Box
        padding={"2rem"}
        justifyContent="center"
        display={"flex"}
        flexDirection="column"
        justifyItems={"center"}
      >
        <Heading fontSize="4xl" mb={4}>
          Reddit
        </Heading>
        <Heading fontSize="2xl" mb={4}>
          Sign Up
        </Heading>
        <Text as="p" fontSize="sm" width="sm">
          By continuing, you are setting up a Reddit account and agree to our
          User Agreement and Privacy Policy.
        </Text>
        <form onSubmit={formik.handleSubmit}>
          <FormControl mt={8} isRequired>
            <Input
              fontSize="sm"
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              aria-label="username"
              aria-placeholder="username"
              //   variant="filled"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <Input
              fontSize="sm"
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              aria-label="Email Address"
              aria-placeholder="Email Address"
              //   variant="filled"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <Input
              fontSize="sm"
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              aria-label="password"
              aria-placeholder="password"
              //   variant="filled"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <Input
              fontSize="sm"
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              aria-label="name"
              aria-placeholder="name"
              //   variant="filled"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </FormControl>
          <FormControl mt={4}>
            <Textarea
              fontSize="sm"
              id="bio"
              name="bio"
              placeholder="Bio"
              aria-label="bio"
              aria-placeholder="bio"
              //   variant="filled"
              resize="none"
              onChange={formik.handleChange}
              value={formik.values.bio}
            />
          </FormControl>
          <Button
            mt={8}
            w="full"
            fontSize={"sm"}
            colorScheme="green"
            type="submit"
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
}
