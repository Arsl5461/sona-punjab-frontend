/**
 * Detect whether the lead cell should trigger a “new entry” blink:
 * only when that cell just went from empty → first time (not when a time was edited).
 * Day view: “last winner” = last column index matching the global max time for that owner.
 */

export function snapshotGerResultTimes(gerResult) {
  if (!Array.isArray(gerResult)) return new Map();
  const m = new Map();
  for (const o of gerResult) {
    const id = o.pigeonOwnerId;
    m.set(
      id,
      (o.timeList || []).map((t) => (t == null || t === "" ? null : t))
    );
  }
  return m;
}

export function snapshotTotalOwnerPigeons(totalDaysResult) {
  const m = new Map();
  const rows = totalDaysResult?.ownerResults;
  if (!Array.isArray(rows)) return m;
  for (const o of rows) {
    m.set(
      o.ownerId,
      (o.pigeons || []).map((p) => {
        const v = p?.totalTime;
        if (v == null || v === "") return null;
        return v;
      })
    );
  }
  return m;
}

/** Last-winner cell = last occurrence of global max time on the winning owner’s row */
export function isLastWinnerDayCellNewlyFilled(prevMap, gerResult, leadPeak) {
  if (!leadPeak?.ownerId || !Array.isArray(gerResult)) return false;
  const owner = gerResult.find((o) => o.pigeonOwnerId === leadPeak.ownerId);
  if (!owner?.timeList?.length) return false;
  const leadTime = leadPeak.time;
  const idx = owner.timeList.lastIndexOf(leadTime);
  if (idx === -1) return false;

  const prevRow = prevMap.get(leadPeak.ownerId);
  const prevVal = prevRow?.[idx];
  const wasEmpty =
    prevVal == null ||
    prevVal === "" ||
    (Array.isArray(prevRow) && idx >= prevRow.length);
  return wasEmpty;
}

export function isGlobalLeadCellNewlyFilled(prevMap, totalDaysResult, leadPeak) {
  if (!leadPeak?.ownerId || leadPeak.pigeonIndex == null) return false;
  const { ownerId: oid, pigeonIndex: idx, time } = leadPeak;
  const owner = totalDaysResult?.ownerResults?.find((r) => r.ownerId === oid);
  const currVal = owner?.pigeons?.[idx]?.totalTime;
  if (currVal == null || currVal === "" || currVal === 0) return false;
  if (Number(currVal) !== Number(time)) return false;

  const prevRow = prevMap.get(oid);
  const prevVal = prevRow?.[idx];
  const wasEmpty =
    prevVal == null || prevVal === "" || prevVal === 0;
  return wasEmpty;
}
