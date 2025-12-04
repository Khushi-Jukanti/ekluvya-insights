import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

interface ExportButtonProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const ExportButton = ({ transactions, isLoading }: ExportButtonProps) => {
  const exportToExcel = () => {
    if (transactions.length === 0) {
      toast.error("No data to export");
      return;
    }

    const formatDate = (dateString: string) => {
      try {
        const date = parseISO(dateString);
        return format(date, "yyyy-MM-dd HH:mm:ss");
      } catch {
        return dateString;
      }
    };

    const headers = [
      "Date & Time (IST)",
      "User Name",
      "Phone",
      "Email",
      "Coupon Code",
      "Amount (₹)",
      "Agent Name",
      "Agent Phone",
      "Agent Location",
    ];

    const rows = transactions.map((t) => [
      formatDate(t.date),
      t.user_name,
      t.phone,
      t.email,
      t.coupon_code,
      t.amount.toString(),
      t.agent_name,
      t.agent_phone,
      t.agent_location,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `ekluvya-transactions-${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Export successful!", {
      description: `${transactions.length} transactions exported`,
    });
  };

  return (
    <Button
      variant="glass"
      onClick={exportToExcel}
      disabled={isLoading || transactions.length === 0}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Export to Excel
    </Button>
  );
};

export default ExportButton;
