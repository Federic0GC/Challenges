import { useState } from "react";
import { TabBar, type TabKey } from "@/components/TabBar";
import { RecordView } from "@/views/RecordView";
import { LibraryView } from "@/views/LibraryView";
import { TestView } from "@/views/TestView";

const Index = () => {
  const [tab, setTab] = useState<TabKey>("record");
  const [refreshKey, setRefreshKey] = useState(0);
  const bump = () => setRefreshKey((k) => k + 1);

  return (
    <>
      {tab === "record" && <RecordView onSaved={bump} />}
      {tab === "library" && <LibraryView refreshKey={refreshKey} />}
      {tab === "test" && <TestView onChange={bump} />}
      <TabBar active={tab} onChange={setTab} />
    </>
  );
};

export default Index;
