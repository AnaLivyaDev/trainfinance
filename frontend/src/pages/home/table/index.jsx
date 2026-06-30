import { api } from "../../../services/api";
import { Button, Card, Container, Heading, Input, InputGroup, Menu, Portal, Switch, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiDotsVertical, BiSearch, BiUser } from "react-icons/bi";
import { NewStudentForm } from "../form";
import { toaster } from "../../../components/ui/toaster";
import { format, getDaysInMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EditStudentForm } from "../form/edit-form";

export function TableComponent({ onStudentChanged }) {
  const [students, setStudents] = useState([])

  async function getStudents() {
    const response = await api.get("/students")

    onStudentChanged();

    setStudents(response.data)
  }

  useEffect(() => {
    getStudents()
  }, [])

  const [isDeleting, setIsDeleting] = useState(false)
  async function handleDeleteStudent(studentId) {
    setIsDeleting(true)

    try {
      await api.delete(`/students/${studentId}`)

      getStudents()
      
      toaster.create({
        title: "Aluno excluído.",
        type: "success"
      })
    } catch (error) {
      toaster.create({
        title: "Não foi possível excluir o aluno.",
        type: "error"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  async function handlePaymentChange(student, checked) {
    try {
      if (checked) {
        const today = new Date();

        await api.post("/payments", {
          studentId: student.id,
          referenceMonth: today.getMonth() + 1,
          referenceYear: today.getFullYear(),
          paymentDate: today,
          amount: student.monthlyFee,
        });

        toaster.create({
          title: "Pagamento registrado.",
          type: "success",
        });
      } else {
        await api.delete(
          `/payments/${student.currentPaymentId}`
        );

        toaster.create({
          title: "Pagamento removido.",
          type: "success",
        });
      }

      await getStudents();
      onStudentChanged?.();
    } catch (error) {
      toaster.create({
        title:
          error.response?.data?.message ||
          "Erro ao atualizar pagamento.",
        type: "error",
      });
    }
  }

  const [editModalIsOpen, setEditModalIsOpen] = useState(false)
  const [studentToEdit, setStudentToEdit] = useState()
  async function handleSelectStudentToEdit(student) {
    console.log(student)
    setEditModalIsOpen(true)
    setStudentToEdit(student)
  }

  return (
    <Container maxW="7xl" paddingBottom={8}>
      <Card.Root>
        <Card.Header display="flex" flexDir="row" justifyContent="space-between" alignItems="center" paddingTop={4}>
          <Heading fontSize={20} fontWeight="medium">
            Alunos
          </Heading>

          <NewStudentForm onSuccess={getStudents} />
        </Card.Header>

        <Card.Body>
          <InputGroup startElement={<BiSearch />}>
            <Input placeholder="Pesquisar aluno" />
          </InputGroup>

          <Table.Root size="lg" marginTop={3} striped>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Nome</Table.ColumnHeader>
                <Table.ColumnHeader>Telefone</Table.ColumnHeader>
                <Table.ColumnHeader>Mensalidade</Table.ColumnHeader>
                <Table.ColumnHeader>Vencimento</Table.ColumnHeader>
                <Table.ColumnHeader>Situação <span style={{ opacity: 0.6 }}>({formatDate(new Date())})</span></Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end"></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {students.map(s => {
                const paidCurrentMonth = s.paidCurrentMonth
                let dueDay = null

                if (s.dueDay) {
                  const today = new Date();
  
                  const day = Math.min(
                    s.dueDay,
                    getDaysInMonth(today)
                  );
  
                  const dueDate = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    day
                  );
  
                  dueDay = format(
                    dueDate,
                    "dd/MM/yyyy",
                    { locale: ptBR }
                  );
                }

                return (
                  <Table.Row key={s.id}>
                    <Table.Cell height="56.8px" whiteSpace="nowrap" display="flex" alignItems="center" gap="1">
                      <BiUser />
                      {s.name}
                    </Table.Cell>
                    <Table.Cell whiteSpace="nowrap">
                      {s.phone}
                    </Table.Cell>
                    <Table.Cell whiteSpace="nowrap">
                      {s.studentType === "STANDARD" ? Number(s.monthlyFee).toLocaleString('pt-BR', { style: "currency", currency: "BRL" }) : "-"}
                    </Table.Cell>
                    <Table.Cell whiteSpace="nowrap">
                      {dueDay ?? "-"}
                    </Table.Cell>
                    <Table.Cell whiteSpace="nowrap">
                      {s.studentType === "STANDARD" ? (
                        <>
                          <Switch.Root
                            checked={paidCurrentMonth}
                            onCheckedChange={(e) => handlePaymentChange(s, e.checked)}
                          >
                            <Switch.HiddenInput />
                            <Switch.Control>
                              <Switch.Thumb />
                            </Switch.Control>
                            <Switch.Label />
                          </Switch.Root>

                          Pendente
                        </>
                      ) : "-"}
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <Menu.Root>
                        <Menu.Trigger asChild>
                          <Button variant="ghost" size="xs">
                            <BiDotsVertical />
                          </Button>
                        </Menu.Trigger>
                        <Portal>
                          <Menu.Positioner>
                            <Menu.Content>
                              <Menu.Item onClick={() => handleSelectStudentToEdit(s)}>
                                Editar
                              </Menu.Item>
                              <Menu.Item>
                                Histórico
                              </Menu.Item>
                              <Menu.Item disabled={isDeleting} onClick={() => handleDeleteStudent(s.id)}>
                                {!isDeleting ? "Excluir" : "Excluindo..."}
                              </Menu.Item>
                            </Menu.Content>
                          </Menu.Positioner>
                        </Portal>
                      </Menu.Root>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table.Root>
       </Card.Body>
      </Card.Root>

      <EditStudentForm open={editModalIsOpen} setOpen={setEditModalIsOpen} student={studentToEdit} onSuccess={getStudents} />
    </Container>
  )
}

function formatDate(data) {
  const texto = data.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  return `${texto.charAt(0).toUpperCase() + texto.slice(1)}`;
}