import { useEffect } from "react";
import { useEventStore } from "../lib/store/useEventStore";

export function useContractEvents() {
  const { events, filterType, isLivePolling, isLoading, fetchEvents, setFilterType, toggleLivePolling } =
    useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (!isLivePolling) return;
    const interval = setInterval(() => {
      fetchEvents();
    }, 4000);
    return () => clearInterval(interval);
  }, [isLivePolling, fetchEvents]);

  const filteredEvents = events.filter((e) => {
    if (filterType === "ALL") return true;
    return e.type === filterType;
  });

  return {
    events: filteredEvents,
    allEventsCount: events.length,
    filterType,
    isLivePolling,
    isLoading,
    setFilterType,
    toggleLivePolling,
    refreshEvents: fetchEvents,
  };
}
