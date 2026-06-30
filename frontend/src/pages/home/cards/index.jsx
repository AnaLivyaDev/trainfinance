import { api } from "../../../services/api";
import { Card, Container, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export function Cards({ refresh }) {
  const [cardsData, setCardsData] = useState()

  async function getCardsData() {
    const response = await api.get("/cards")

    setCardsData(response.data)
  }

  useEffect(() => {
    getCardsData()
  }, [refresh])

  return (
    <Container maxW="7xl" display="flex" gap={6}>
      <CardItem value={cardsData?.totalStudents} label={"total de estudantes"} />
      <CardItem value={cardsData?.pendingPayments} label={"pagamentos pendentes no mês"} />
      <CardItem value={cardsData?.monthlyRevenue ? Number(cardsData.monthlyRevenue).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "R$ 0,00"} label={"receital do mês atual"} />
    </Container>
  )
}

function CardItem({ value, label }) {
  return (
    <Card.Root flex={1} variant="outline">
      <Card.Body>
        <Text fontSize={24} fontWeight="medium">
          {value}
        </Text>
        <Text>
          {label}
        </Text>
      </Card.Body>
    </Card.Root>
  )
}