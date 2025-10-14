import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";

export default function NightAuditHeaderSection() {
  const [auditDate, setAuditDate] = useState<Date | undefined>(new Date());
  const [roomNo, setRoomNo] = useState("");

  const formattedDate = auditDate ? format(auditDate, "dd/MM/yyyy") : "";

  const handleSearch = () => {
    if (!roomNo) {
      toast.error("Please enter a room number!");
      return;
    }
    toast.success(`Searched Room No: ${roomNo} on ${formattedDate}`);
  };

  return (
    <div className="space-y-4 border rounded-xl p-6 bg-card shadow-sm">
      {/* Current Date Section */}
      {/* Current Date Section - Four Rows with Date Beside */}
      <div className="space-y-2 text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">CURRENT ROOM DATE:</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center  gap-2">
          <span className="text-muted-foreground">CURRENT SERVICE DATE:</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            CURRENT RESTAURANT DATE:
          </span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">CURRENT BANQUET DATE:</span>
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Audit Date, Room No, and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {/* Audit Date */}
        <div className="flex flex-col">
          <label className="text-sm text-left ml-1 font-medium mb-1">
            Audit Date:
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formattedDate || <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={auditDate}
                onSelect={setAuditDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Room No */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-left ml-1">
            Room No:
          </label>
          <Input
            placeholder="Enter Room No."
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-transparent">
            Search
          </label>
          <Button className="w-1/3" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
