export const generaId = () => {
  return Math.random().toString(36).slice(2);
}

// 传入dashboard的ref, 和当前鼠标的位置, 返回当前鼠标在第几行第几列
export const getMousePosition = (dashboardRef, { clientX, clientY }, rol) => {
  const { left, top } = dashboardRef.getBoundingClientRect();
  const x = clientX - left;
  const y = clientY - top;
  const col = Math.floor(x / 100);
  const row = Math.floor(y / 100);
  return { col, row };
}
