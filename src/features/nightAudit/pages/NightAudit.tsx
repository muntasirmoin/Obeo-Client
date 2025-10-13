import TitleSubtitle from "@/Features/serviceBill/Components/TitleSubtitle";
import AuditDateForm from "./AuditDateForm";
import AuditPage from "./AuditPage";

const NightAudit = () => {
  return (
    <div className="m-2.5">
      <TitleSubtitle title="Night Audit Information" />
      <AuditDateForm />
      <AuditPage />
    </div>
  );
};

export default NightAudit;
