let y = 0;
function experiment(x) {
  let z = x;
  console.log(z);
  z++;
  y++;
  console.error(y)
  if (y < 100) {
    experiment(z);
  }
  console.log(y,z)
}

experiment(1);
