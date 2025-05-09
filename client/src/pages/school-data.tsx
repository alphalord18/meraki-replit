// File: src/pages/combined-table.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { useLocation } from 'wouter';  // ✅ Changed here

export default function CombinedTable() {
  const [schoolInfo, setSchoolInfo] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [eventSummary, setEventSummary] = useState<any[]>([]);

  const [, navigate] = useLocation(); // ✅ Changed here

  const code = new URLSearchParams(window.location.search).get('code');  // Get 'code' from the URL query parameters

  useEffect(() => {
    if (!code) {
      navigate('/school-entry');  // ✅ Changed to Wouter-compatible
      return;
    }

    const fetchData = async () => {
      const { data: schoolData } = await supabase
        .from('schools')
        .select('school_name, school_id, coordinator_name, coordinator_phone, coordinator_email, address')
        .eq('school_id', code.toUpperCase())
        .single();

      const { data: participantData } = await supabase
        .from('participants')
        .select('participant_name, class, event_id')
        .eq('school_id', code.toUpperCase());

      const { data: eventsData } = await supabase
        .from('events')
        .select('event_id, event_name');

      const eventMap = Object.fromEntries(
        eventsData?.map((e: any) => [e.event_id, e.event_name]) || []
      );

      const summaryMap: Record<string, any> = {};

      participantData?.forEach((p: any) => {
        const eventName = eventMap[p.event_id];
        if (!summaryMap[eventName]) {
          summaryMap[eventName] = {
            event_name: eventName,
            no_of_participants: 0,
            power_rangerz: [],
            avengers: [],
            titans: [],
          };
        }

        summaryMap[eventName].no_of_participants++;

        if (p.class >= 6 && p.class <= 7)
          summaryMap[eventName].power_rangerz.push(`${p.participant_name} (${p.class})`);
        else if (p.class >= 8 && p.class <= 9)
          summaryMap[eventName].avengers.push(`${p.participant_name} (${p.class})`);
        else if (p.class >= 10 && p.class <= 12)
          summaryMap[eventName].titans.push(`${p.participant_name} (${p.class})`);
      });

      setSchoolInfo(schoolData);
      setParticipants(participantData || []);
      setEventSummary(Object.values(summaryMap));
    };

    fetchData();
  }, [code]);

  const exportToExcel = () => {
    const rows: any[] = [];

    rows.push(['School Details']);
    rows.push(['School Name', schoolInfo.school_name]);
    rows.push(['School Address', schoolInfo.address]);
    rows.push(['School Code', schoolInfo.school_id]);
    rows.push(['Teacher Coordinator', schoolInfo.coordinator_name]);
    rows.push(['Contact No.', schoolInfo.coordinator_phone]);
    rows.push(['Contact Email', schoolInfo.coordinator_email]);
    rows.push([]);

    rows.push(['Participants']);
    rows.push(['Name', 'Class']);
    participants.forEach((p) => {
      rows.push([p.participant_name, p.class]);
    });
    rows.push([]);

    rows.push(['Event Summary']);
    rows.push(['S. No', 'Event', 'Total', 'Power Rangerz', 'Avengers', 'Titans']);
    eventSummary.forEach((e: any, i: number) => {
      rows.push([
        i + 1,
        e.event_name,
        e.no_of_participants,
        e.power_rangerz.join(', '),
        e.avengers.join(', '),
        e.titans.join(', '),
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const bold = { font: { bold: true } };
    ['A1', 'A6', 'A8'].forEach((cell) => ws[cell] && (ws[cell].s = bold));
    ['A2', 'A3', 'A4', 'A5', 'A7', 'B7'].forEach((cell) => ws[cell] && (ws[cell].s = {}));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `School_${code}_Report.xlsx`);
  };

  if (!schoolInfo) return null;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">School Details</h2>
      {schoolInfo && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <p><strong>School Name :</strong> {schoolInfo.school_name}</p>
          <p><strong>School Address :</strong> {schoolInfo.address}</p>
          <p><strong>School Code : </strong> {schoolInfo.school_id}</p>
          <p><strong>Teacher Coordinator :</strong> {schoolInfo.coordinator_name}</p>
          <p><strong>Contact No. :</strong> {schoolInfo.coordinator_phone}</p>
          <p><strong>Contact Emaol :</strong> {schoolInfo.coordinator_email}</p>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold">Participants</h3>
        <table className="w-full border mt-2">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Class</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, i) => (
              <tr key={i}>
                <td className="border p-2">{p.participant_name}</td>
                <td className="border p-2">{p.class}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Event Summary</h3>
        <table className="w-full border mt-2">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">S. No</th>
              <th className="border p-2">Event</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Power Rangerz</th>
              <th className="border p-2">Avengers</th>
              <th className="border p-2">Titans</th>
            </tr>
          </thead>
          <tbody>
            {eventSummary.map((e, i) => (
              <tr key={i}>
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">{e.event_name}</td>
                <td className="border p-2">{e.no_of_participants}</td>
                <td className="border p-2">{e.power_rangerz.join(', ')}</td>
                <td className="border p-2">{e.avengers.join(', ')}</td>
                <td className="border p-2">{e.titans.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button className="mt-4" onClick={exportToExcel}>
        Export to Excel
      </Button>
    </div>
  );
}

