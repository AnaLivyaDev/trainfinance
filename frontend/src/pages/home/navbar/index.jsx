import { ColorModeButton } from "../../../components/ui/color-mode";
import { Container, Heading } from "@chakra-ui/react";

export function Navbar() {
  return (
    <div>
      <Container
        maxW="7xl"
        paddingY={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/logo.svg" alt="" style={{ width: 50 }} />
          <Heading size="md" fontWeight="semibold" color="colorPalette.contrast">
            TRAIN FINANCE
          </Heading>
        </div>

        <ColorModeButton />
      </Container>
    </div>
  );
}
