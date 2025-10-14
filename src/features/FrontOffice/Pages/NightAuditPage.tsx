import NightAuditHeaderSection from "../Components/NightAudit/NightAuditHeaderSection";
import NightAuditTableSection from "../Components/NightAudit/NightAuditTableSection";

export default function NightAuditPage() {
  return (
    <div className="p-6  mx-auto space-y-6">
      <NightAuditHeaderSection />
      <NightAuditTableSection />
    </div>
  );
}
