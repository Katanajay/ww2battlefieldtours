function fireBullets() {
  const gunshot = document.getElementById("gunshot");

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const hole = document.createElement("div");
      hole.classList.add("bullet-hole");
      hole.style.top = Math.random() * (window.innerHeight - 40) + "px";
      hole.style.left = Math.random() * (window.innerWidth - 40) + "px";
      document.body.appendChild(hole);

      const shot = gunshot.cloneNode();
      shot.play();
    }, i * 200);
  }

  // redirect once, after the loop finishes, just reminding myself if i want to change the delay //
  setTimeout(() => {
    window.location.href = "/northern-france";
  }, 2000);
}
