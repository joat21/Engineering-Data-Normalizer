import { FileSpreadsheet, FileText } from "lucide-react";
import { FeaturesList } from "./FeaturesList";
import { ImportCard } from "./ImportCard";
import { AppLink } from "@/shared/ui";

export const ImportPage = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Импорт данных</h1>
        <p className="text-default-foreground">
          Выберите тип документа для загрузки. В зависимости от формата будет
          использоваться разный сценарий обработки данных.
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-6 text-default-foreground/30">
          <FileSpreadsheet size={48} />
          <div className="w-10 h-px bg-default-foreground/20" />
          <FileText size={48} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AppLink to="catalog" className="no-underline h-full">
          <ImportCard
            title="Каталог"
            icon={FileSpreadsheet}
            description="Импорт табличных данных из Excel-файлов с возможностью выделения и настройки структуры таблицы."
          >
            <FeaturesList
              features={[
                "выбор листа документа",
                "выделение таблицы",
                "сопоставление колонок",
              ]}
            />
          </ImportCard>
        </AppLink>

        <AppLink to="single" className="no-underline h-full">
          <ImportCard
            title="Паспорт изделия"
            icon={FileText}
            description="Импорт неструктурированных документов (PDF, Word) с ручным вводом характеристик оборудования."
          >
            <FeaturesList
              features={[
                "выбор категории оборудования",
                "ввод параметров вручную",
                "поддержка сложных описаний",
              ]}
            />
          </ImportCard>
        </AppLink>
      </div>
    </div>
  );
};
