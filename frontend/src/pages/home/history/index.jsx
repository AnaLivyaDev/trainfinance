import { useEffect, useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Fieldset,
  For,
  Input,
  NativeSelect,
  Stack,
  Switch,
  Table,
} from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";
import { toaster } from "../../../components/ui/toaster";
import { api } from "../../../services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function StudentHistory({ student, open, setOpen }) {
  console.log(student)

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        setOpen(e.open);
      }}
        size="lg"
    >
      <Dialog.Backdrop />

      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger asChild>
            <CloseButton />
          </Dialog.CloseTrigger>

          <Dialog.Header>
            <Dialog.Title>
              Histórico Aluno
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <Table.Root size="lg" mt={3} striped>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Mês</Table.ColumnHeader>
                  <Table.ColumnHeader>Vencimento</Table.ColumnHeader>
                  <Table.ColumnHeader>Valor</Table.ColumnHeader>
                  <Table.ColumnHeader>Situação</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end"></Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {student?.history?.map((history) => {
                  const date = new Date(history.year, history.month - 1);

                  const dueDate = student.dueDay
                    ? format(
                        new Date(history.year, history.month - 1, student.dueDay),
                        "dd/MM/yyyy",
                        { locale: ptBR }
                      )
                    : "-";

                  return (
                    <Table.Row key={`${history.year}-${history.month}`}>
                      <Table.Cell>
                        {format(date, "MMMM/yyyy", {
                          locale: ptBR,
                        })}
                      </Table.Cell>

                      <Table.Cell>{dueDate}</Table.Cell>

                      <Table.Cell>
                        {student.studentType === "STANDARD"
                          ? Number(student.monthlyFee).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : "-"}
                      </Table.Cell>

                      <Table.Cell>
                        {history.paid ? "Pago" : "Pendente"}
                      </Table.Cell>

                      <Table.Cell textAlign="end">
                        <Switch.Root
                          checked={history.paid}
                          onCheckedChange={(e) =>
                            handlePaymentHistoryChange(history, e.checked)
                          }
                        >
                          <Switch.HiddenInput />
                          <Switch.Control>
                            <Switch.Thumb />
                          </Switch.Control>
                        </Switch.Root>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}