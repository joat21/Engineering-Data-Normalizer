import { Button, Form, Modal } from "@heroui/react";
import { FormProvider, useForm, type FieldValues } from "react-hook-form";
import {
  MappingTargetType,
  type MappingTarget,
} from "@engineering-data-normalizer/shared";
import { useTransformationContextStore } from "../model/store";
import { transformAttribute } from "../model/transformAttribute";
import { useResolveNormalizationIssuesMutation } from "@/features/import";
import { AttributeField } from "@/entities/category-attribute";

const getTargetKey = (target: MappingTarget) =>
  target.type === MappingTargetType.ATTRIBUTE ? target.id : target.field;

export const ResolveNormalizationIssuesModal = () => {
  // компонент AttributeField использует RHF,
  // поэтому здесь тоже нужен провайдер
  // TODO: переписать handleSubmit под работу с RHF (убрать formData)
  const methods = useForm<FieldValues>({ mode: "onChange" });

  const resolveNormalizationIssuesMutation =
    useResolveNormalizationIssuesMutation();

  const normalizationContext = useTransformationContextStore(
    (s) => s.normalizationContext,
  );
  const setNormalizationContext = useTransformationContextStore(
    (s) => s.setNormalizationContext,
  );

  const isOpen = !!normalizationContext;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!normalizationContext) return;
    const { issues, metadata } = normalizationContext;

    const formData = new FormData(e.currentTarget);

    const resolutions = issues.flatMap((issue) => {
      return issue.unnormalizedValues.map((val) => {
        const fieldKey = `${getTargetKey(issue.target)}|${val}`;

        // Моковый объект атрибута, чтобы переиспользовать transformAttribute
        const mockAttr = {
          key: fieldKey,
          dataType: issue.target.dataType,
          options: issue.normalizationOptions,
        };

        const { normalized } = transformAttribute({
          formData,
          attr: mockAttr as any,
        });

        return {
          target: issue.target,
          rawValue: val,
          normalized,
        };
      });
    });

    const payload = {
      ...metadata,
      resolutions,
    };

    resolveNormalizationIssuesMutation.mutate(payload, {
      onSuccess: () => setNormalizationContext(null),
    });
  };

  return (
    <Modal.Backdrop isOpen={isOpen}>
      <Modal.Container>
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Требуется уточнение данных</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <FormProvider {...methods}>
              <Form id="resolve-normalization-issues" onSubmit={handleSubmit}>
                {normalizationContext?.issues.map((issue) =>
                  issue.unnormalizedValues.map((val) => (
                    <AttributeField
                      key={getTargetKey(issue.target)}
                      attributeKey={`${getTargetKey(issue.target)}|${val}`}
                      label={`${issue.target.label}: ${val}`}
                      //
                      unit=""
                      options={issue.normalizationOptions}
                      dataType={issue.target.dataType}
                      variant="secondary"
                    />
                  )),
                )}
              </Form>
            </FormProvider>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" form="resolve-normalization-issues">
              Сохранить
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
