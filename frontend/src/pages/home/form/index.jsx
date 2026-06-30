import { useState } from "react";
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
} from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";
import { toaster } from "../../../components/ui/toaster";
import { api } from "../../../services/api";

const initialFormData = {
  name: "",
  phone: "",
  studentType: "",
  monthlyFee: "",
  monthlyFeeDisplay: "",
  dueDay: "",
};

const initialErrors = {
  name: "",
  phone: "",
  studentType: "",
  monthlyFee: "",
  dueDay: "",
};

export function NewStudentForm({ onSuccess }) {
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);

  function resetForm() {
    setFormData(initialFormData);
    setErrors(initialErrors);
  }

  function updateField(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  }

  function formatPhone(value) {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 2) {
      return numbers;
    }

    if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }

    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(
        2,
        6
      )}-${numbers.slice(6)}`;
    }

    return `(${numbers.slice(0, 2)}) ${numbers.slice(
      2,
      7
    )}-${numbers.slice(7)}`;
  }

  function handleMonthlyFeeChange(e) {
    const numbers = e.target.value.replace(/\D/g, "");

    const amount = Number(numbers) / 100;

    setFormData((prev) => ({
      ...prev,
      monthlyFee: amount.toFixed(2),
      monthlyFeeDisplay: amount.toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL",
        }
      ),
    }));

    if (errors.monthlyFee) {
      setErrors((prev) => ({
        ...prev,
        monthlyFee: "",
      }));
    }
  }

  function validate() {
    const newErrors = {
      name: "",
      phone: "",
      studentType: "",
      monthlyFee: "",
      dueDay: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "O nome é obrigatório.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "O telefone é obrigatório.";
    }

    if (!formData.studentType) {
      newErrors.studentType = "Selecione um tipo.";
    }

    if (formData.studentType === "STANDARD") {
      if (!formData.monthlyFee) {
        newErrors.monthlyFee =
          "Informe o valor da mensalidade.";
      }

      if (!formData.dueDay) {
        newErrors.dueDay =
          "Informe o dia do vencimento.";
      }
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  }

  async function handleSubmit() {
    if (!validate()) {
      return;
    }

    const payload = {
      name: formData.name,
      phone: formData.phone,
      studentType: formData.studentType,
      monthlyFee:
        formData.studentType === "STANDARD"
          ? Number(formData.monthlyFee)
          : null,
      dueDay:
        formData.studentType === "STANDARD"
          ? Number(formData.dueDay)
          : null,
    };

    setIsLoading(true)

    try {
      await api.post("/students", payload)

      onSuccess()

      toaster.create({
        title: "Aluno cadastrado com sucesso.",
        type: "success"
      })

      resetForm()
      setOpen(false)
    } catch (error) {
      toaster.create({
        title: "Não foi possível cadastrar o aluno.",
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        setOpen(e.open);

        if (!e.open) {
          resetForm();
        }
      }}
    >
      <Dialog.Trigger asChild>
        <Button>
          <RiAddLine />
          Novo aluno
        </Button>
      </Dialog.Trigger>

      <Dialog.Backdrop />

      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger asChild>
            <CloseButton />
          </Dialog.CloseTrigger>

          <Dialog.Header>
            <Dialog.Title>
              Cadastrar Aluno
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <Fieldset.Root>
              <Fieldset.Content>
                <Field.Root invalid={!!errors.name}>
                  <Field.Label>Nome</Field.Label>

                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      updateField(
                        "name",
                        e.target.value
                      )
                    }
                  />

                  {errors.name && (
                    <Field.ErrorText>
                      <Field.ErrorIcon />
                      {errors.name}
                    </Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.phone}>
                  <Field.Label>Telefone</Field.Label>

                  <Input
                    value={formData.phone}
                    onChange={(e) => updateField("phone", formatPhone(e.target.value))}
                  />

                  {errors.phone && (
                    <Field.ErrorText>
                      <Field.ErrorIcon />
                      {errors.phone}
                    </Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.studentType}>
                  <Field.Label>Tipo</Field.Label>

                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={formData.studentType}
                      onChange={(e) => {
                        const value =
                          e.target.value;

                        setFormData((prev) => ({
                          ...prev,
                          studentType: value,
                          ...(value ===
                            "SOCIAL" && {
                            monthlyFee: "",
                            monthlyFeeDisplay:
                              "",
                            dueDay: "",
                          }),
                        }));
                      }}
                    >
                      <option value=""></option>

                      <For
                        each={[
                          {
                            label: "Padrão",
                            value: "STANDARD",
                          },
                          {
                            label: "Social",
                            value: "SOCIAL",
                          },
                        ]}
                      >
                        {(item) => (
                          <option
                            key={item.value}
                            value={item.value}
                          >
                            {item.label}
                          </option>
                        )}
                      </For>
                    </NativeSelect.Field>

                    <NativeSelect.Indicator />
                  </NativeSelect.Root>

                  {errors.studentType && (
                    <Field.ErrorText>
                      <Field.ErrorIcon />
                      {errors.studentType}
                    </Field.ErrorText>
                  )}
                </Field.Root>

                {formData.studentType ===
                  "STANDARD" && (
                  <Stack direction="row">
                    <Field.Root
                      invalid={!!errors.monthlyFee}
                    >
                      <Field.Label>
                        Mensalidade
                      </Field.Label>

                      <Input
                        type="text"
                        inputMode="numeric"
                        value={
                          formData.monthlyFeeDisplay
                        }
                        onChange={
                          handleMonthlyFeeChange
                        }
                      />

                      {errors.monthlyFee && (
                        <Field.ErrorText>
                          <Field.ErrorIcon />
                          {errors.monthlyFee}
                        </Field.ErrorText>
                      )}
                    </Field.Root>

                    <Field.Root
                      invalid={!!errors.dueDay}
                    >
                      <Field.Label>
                        Dia do vencimento
                      </Field.Label>

                      <NativeSelect.Root>
                        <NativeSelect.Field
                          value={formData.dueDay}
                          onChange={(e) =>
                            updateField(
                              "dueDay",
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                          </option>

                          {Array.from(
                            { length: 31 },
                            (_, index) => (
                              <option
                                key={index + 1}
                                value={index + 1}
                              >
                                Dia {index + 1}
                              </option>
                            )
                          )}
                        </NativeSelect.Field>

                        <NativeSelect.Indicator />
                      </NativeSelect.Root>

                      {errors.dueDay && (
                        <Field.ErrorText>
                          <Field.ErrorIcon />
                          {errors.dueDay}
                        </Field.ErrorText>
                      )}
                    </Field.Root>
                  </Stack>
                )}
              </Fieldset.Content>
            </Fieldset.Root>
          </Dialog.Body>

          <Dialog.Footer>
            <Button disabled={isLoading} onClick={handleSubmit}>
              {!isLoading ? "Salvar" : "Salvando..."}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}