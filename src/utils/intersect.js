export function intersect(wall, line) {
  switch (wall.type) {
    case "rect":
      return intersect_rect(wall, line);
    default:
      throw new Error(`unknown wall type: ${wall.type}`);
  }
}

function intersect_rect(wall, line) {
  const { x, y, height, width } = wall;
  return (
    intersect_segment([[x, y], [x + width, y]], line) ||
    intersect_segment([[x, y + height], [x + width, y + height]], line) ||
    intersect_segment([[x, y], [x, y + height]], line) ||
    intersect_segment([[x + width, y], [x + width, y + height]], line)
  );
}
function intersect_segment(line1, line2) {
  // Две линии AB и CD
  const [[A1x, A1y], [A2x, A2y]] = line1;
  const [[B1x, B1y], [B2x, B2y]] = line2;

  // Ограничительные рамки
  if (!(A1x <= B2x && A2x >= B1x && A1y <= B2y && A2y >= B1y)) return false;

  return true;
}
