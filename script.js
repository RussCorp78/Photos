// Temporary test data. Later this array can be replaced with records from Supabase.
const photos = [
  {
    title: "Sheffield at Dusk",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85",
    description: "A quiet evening view as the light started to fade.",
    date: "18 October 2026",
    dateTime: "2026-10-18",
    location: "Sheffield",
    keywords: ["sheffield", "city", "evening", "dusk"]
  },
  {
    title: "Across the Hills",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=85",
    description: "One of those views that makes you stop for a minute.",
    date: "4 October 2026",
    dateTime: "2026-10-04",
    location: "South Yorkshire",
    keywords: ["hills", "landscape", "yorkshire", "countryside"]
  },
  {
    title: "Autumn Walk",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=85",
    description: "Autumn colour catching the last of the afternoon light.",
    date: "27 September 2026",
    dateTime: "2026-09-27",
    location: "Yorkshire",
    keywords: ["autumn", "trees", "woodland", "walk"]
  }
];

const elements = {
  polaroid: document.querySelector("#polaroid"),
  image: document.querySelector("#photo-image"),
  title: document.querySelector("#photo-title"),
  description: document.querySelector("#photo-description"),
  date: document.querySelector("#photo-date"),
  location: document.querySelector("#photo-location"),
  counter: document.querySelector("#photo-counter"),
  search: document.querySelector("#photo-search"),
  noResults: document.querySelector("#no-results"),
  previous: document.querySelector("#previous-button"),
  next: document.querySelector("#next-button")
};

let currentPhotoIndex = 0;
let matchingIndexes = photos.map((_, index) => index);

function getSearchableText(photo) {
  return [
    photo.title,
    photo.description,
    photo.location,
    ...photo.keywords
  ].join(" ").toLowerCase();
}

function renderPhoto(animate = true) {
  if (matchingIndexes.length === 0) {
    elements.polaroid.hidden = true;
    elements.noResults.hidden = false;
    elements.previous.disabled = true;
    elements.next.disabled = true;
    elements.counter.textContent = "0 / 0";
    return;
  }

  if (!matchingIndexes.includes(currentPhotoIndex)) {
    currentPhotoIndex = matchingIndexes[0];
  }

  const photo = photos[currentPhotoIndex];
  const update = () => {
    elements.image.src = photo.image;
    elements.image.alt = photo.title;
    elements.title.textContent = photo.title;
    elements.description.textContent = photo.description;
    elements.date.textContent = photo.date;
    elements.date.dateTime = photo.dateTime;
    elements.location.textContent = `📍 ${photo.location}`;
    elements.counter.textContent = `${matchingIndexes.indexOf(currentPhotoIndex) + 1} / ${matchingIndexes.length}`;
    elements.polaroid.hidden = false;
    elements.noResults.hidden = true;
    elements.previous.disabled = false;
    elements.next.disabled = false;
    elements.polaroid.classList.remove("changing");
  };

  if (animate) {
    elements.polaroid.classList.add("changing");
    window.setTimeout(update, 140);
  } else {
    update();
  }
}

function move(direction) {
  if (matchingIndexes.length === 0) return;

  const position = Math.max(0, matchingIndexes.indexOf(currentPhotoIndex));
  const nextPosition = (position + direction + matchingIndexes.length) % matchingIndexes.length;
  currentPhotoIndex = matchingIndexes[nextPosition];
  renderPhoto();
}

function searchPhotos() {
  const term = elements.search.value.trim().toLowerCase();

  matchingIndexes = photos
    .map((photo, index) => ({ photo, index }))
    .filter(({ photo }) => !term || getSearchableText(photo).includes(term))
    .map(({ index }) => index);

  currentPhotoIndex = matchingIndexes[0] ?? 0;
  renderPhoto(false);
}

elements.previous.addEventListener("click", () => move(-1));
elements.next.addEventListener("click", () => move(1));
elements.search.addEventListener("input", searchPhotos);

document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") move(-1);
  if (event.key === "ArrowRight") move(1);
});

renderPhoto(false);
