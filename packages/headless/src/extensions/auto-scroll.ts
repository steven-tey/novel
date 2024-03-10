export const getSpeed = (e: DragEvent, gap: number) => {
  const { clientY } = e;
  if (clientY < gap) {
    const speed = (gap - clientY) / 5;
    return -Math.min(speed, 15);
  }

  const bottomGap = window.innerHeight - gap;
  if (clientY > bottomGap) {
    const speed = (clientY - bottomGap) / 5;
    return Math.min(speed, 15);
  }

  return 0;
};
