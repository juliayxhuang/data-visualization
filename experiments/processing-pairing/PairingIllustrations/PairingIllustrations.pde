import java.io.File;
import java.io.PrintWriter;

// Hensel et al. (2021), Table 6: these are overlapping percentages of people
// reporting ever using a technique, NOT orgasm rates or slices of one whole.
final String SOURCE_CSV = "../../../data/raw/hensel-2021-pairing.csv";
final String SOURCE_DOI = "10.1371/journal.pone.0249242";
final int CANVAS = 1200;
final String COMPARISON_LAYOUT = "two_by_two"; // Also supports "stacked".

final String[] TECHNIQUES = {
  "Solo Pairing with a finger",
  "Solo Pairing with a sex toy",
  "Partner Pairing with a finger",
  "Partner Pairing with a sex toy"
};
final String[] SHORT_LABELS = {
  "Self-applied finger",
  "Self-applied toy",
  "Partner-applied finger",
  "Partner-applied toy"
};
// Provisional mapping for review. Replace filenames here to test other drawings.
final String[] ART_FILES = {
  "IMG_1712.PNG", "IMG_1731.PNG", "IMG_1713.PNG", "IMG_1732.PNG"
};
final String[] EXPORT_NAMES = {
  "self-finger", "self-toy", "partner-finger", "partner-toy"
};

Technique[] techniques;
File runFolder;
PrintWriter manifest;

void setup() {
  noLoop();
  loadDataAndArt();
  openRunFolder();
  try {
    for (int i = 0; i < techniques.length; i++) {
      renderIndividual(i);
    }
    renderComparison();
  } finally {
    manifest.flush();
    manifest.close();
  }
  println("Saved five images to " + runFolder.getAbsolutePath());
  exit();
}

void draw() { }

void loadDataAndArt() {
  Table table = loadTable(sketchPath(SOURCE_CSV), "header");
  if (table == null || table.getRowCount() != 7) {
    throw new RuntimeException("Expected seven source rows in " + SOURCE_CSV);
  }
  techniques = new Technique[TECHNIQUES.length];
  for (int i = 0; i < TECHNIQUES.length; i++) {
    int foundIndex = -1;
    for (int j = 0; j < table.getRowCount(); j++) {
      if (TECHNIQUES[i].equals(table.getString(j, "technique"))) foundIndex = j;
    }
    if (foundIndex < 0) throw new RuntimeException("Missing technique: " + TECHNIQUES[i]);
    float percent = table.getFloat(foundIndex, "weighted_percent");
    int n = table.getInt(foundIndex, "reported_n");
    int denominator = table.getInt(foundIndex, "table_denominator_n");
    if (percent < 0 || percent > 100 || round(percent * 10) != percent * 10 || denominator != 2877 || n <= 0) {
      throw new RuntimeException("Invalid source value for " + TECHNIQUES[i]);
    }
    PImage original = loadImage("data/" + ART_FILES[i]);
    if (original == null) throw new RuntimeException("Missing illustration: " + ART_FILES[i]);
    PImage trimmed = trimTransparent(original);
    techniques[i] = new Technique(TECHNIQUES[i], SHORT_LABELS[i], ART_FILES[i],
      EXPORT_NAMES[i], round(percent * 10), n, denominator, trimmed);
  }
}

PImage trimTransparent(PImage image) {
  image.loadPixels();
  int left = image.width, top = image.height, right = -1, bottom = -1;
  for (int y = 0; y < image.height; y++) {
    for (int x = 0; x < image.width; x++) {
      int a = (image.pixels[y * image.width + x] >>> 24) & 255;
      if (a > 16) {
        left = min(left, x);
        top = min(top, y);
        right = max(right, x);
        bottom = max(bottom, y);
      }
    }
  }
  if (right < left) throw new RuntimeException("Illustration has no visible pixels");
  return image.get(left, top, right - left + 1, bottom - top + 1);
}

void openRunFolder() {
  String stamp = nf(year(), 4) + nf(month(), 2) + nf(day(), 2) + "-" +
    nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  File base = new File(sketchPath("output"));
  runFolder = new File(base, "run-" + stamp);
  int suffix = 2;
  while (runFolder.exists()) runFolder = new File(base, "run-" + stamp + "-" + suffix++);
  if (!runFolder.mkdirs()) throw new RuntimeException("Cannot create " + runFolder);
  manifest = createWriter(new File(runFolder, "manifest.csv").getAbsolutePath());
  manifest.println("filename,technique,weighted_percent,full_illustrations,partial_illustration_tenths,remaining_blank_positions,reported_n,table_denominator_n,art_file,source_csv,source_doi,layout");
}

PGraphics newPage() {
  PGraphics p = createGraphics(CANVAS, CANVAS);
  p.beginDraw();
  p.background(255);
  p.fill(0);
  p.noStroke();
  return p;
}

void drawIcon(PGraphics p, PImage art, float centerX, float centerY, float box, float fraction) {
  float scale = min(box / art.width, box / art.height);
  float w = art.width * scale;
  float h = art.height * scale;
  float x = centerX - w / 2;
  float y = centerY - h / 2;
  if (fraction < 1) p.clip(round(x), round(y), ceil(w * fraction), ceil(h));
  p.image(art, x, y, w, h);
  if (fraction < 1) p.noClip();
}

void drawHundred(PGraphics p, Technique t, float x, float y, float step, float box) {
  drawHundred(p, t, x, y, step, box, 10);
}

void drawHundred(PGraphics p, Technique t, float x, float y, float step, float box, int columns) {
  int full = t.tenths / 10;
  float fraction = (t.tenths % 10) / 10.0;
  for (int slot = 0; slot < 100; slot++) {
    float drawn = slot < full ? 1 : (slot == full ? fraction : 0);
    if (drawn <= 0) continue;
    int column = slot % columns;
    int row = slot / columns;
    drawIcon(p, t.art, x + column * step, y + row * step, box, drawn);
  }
}

void drawSourceFooter(PGraphics p, float y) {
  p.fill(0);
  p.textAlign(LEFT, BASELINE);
  p.textSize(17);
  p.text("Each full drawing = 1 percentage point; a partial drawing shows the tenth.", 60, y);
  p.textSize(15);
  p.text("Hensel et al. (2021), Table 6  |  Weighted U.S. women survey, N=2,877  |  doi:" + SOURCE_DOI, 60, y + 30);
}

void renderIndividual(int index) {
  Technique t = techniques[index];
  PGraphics p = newPage();
  p.textAlign(LEFT, BASELINE);
  p.textSize(34);
  p.text(t.label, 70, 85);
  p.textSize(21);
  p.text("Clitoral touch during vaginal penetration", 70, 123);
  p.textSize(82);
  p.text(t.percentText() + "%", 70, 214);
  p.textSize(19);
  p.text("Ever used to orgasm more often or make sex more pleasurable", 70, 253);
  drawHundred(p, t, 260, 314, 77, 61);
  drawSourceFooter(p, 1088);
  savePage(p, t.exportName + ".png", t, "individual grid");
}

void renderComparison() {
  PGraphics p = newPage();
  p.textAlign(LEFT, BASELINE);
  p.textSize(34);
  p.text("Pairing techniques", 60, 72);
  p.textSize(19);
  p.text("Ever used during penetration to orgasm more often or make sex more pleasurable", 60, 107);
  if (COMPARISON_LAYOUT.equals("two_by_two")) drawTwoByTwo(p);
  else if (COMPARISON_LAYOUT.equals("stacked")) drawStacked(p);
  else throw new RuntimeException("Unknown layout: " + COMPARISON_LAYOUT);
  drawSourceFooter(p, 1100);
  savePage(p, "four-techniques-comparison.png", null, COMPARISON_LAYOUT);
}

void drawTwoByTwo(PGraphics p) {
  for (int i = 0; i < techniques.length; i++) {
    Technique t = techniques[i];
    float x = 70 + (i % 2) * 575;
    float y = 166 + (i / 2) * 450;
    p.fill(0);
    p.textAlign(LEFT, BASELINE);
    p.textSize(24);
    p.text(t.label, x, y);
    p.textSize(37);
    p.text(t.percentText() + "%", x, y + 47);
    drawHundred(p, t, x + 115, y + 92, 35, 28);
  }
}

void drawStacked(PGraphics p) {
  for (int i = 0; i < techniques.length; i++) {
    Technique t = techniques[i];
    float y = 182 + i * 217;
    p.fill(0);
    p.textAlign(LEFT, BASELINE);
    p.textSize(23);
    p.text(t.label, 60, y);
    p.textSize(37);
    p.text(t.percentText() + "%", 60, y + 48);
    drawHundred(p, t, 470, y - 32, 27, 23, 25);
  }
}

void savePage(PGraphics p, String filename, Technique t, String layout) {
  p.endDraw();
  p.save(new File(runFolder, filename).getAbsolutePath());
  if (t == null) {
    manifest.println(filename + ",all four,,,,,,,," + SOURCE_CSV + "," + SOURCE_DOI + "," + layout);
  } else {
    int full = t.tenths / 10;
    int partial = t.tenths % 10;
    int blanks = 100 - full - (partial > 0 ? 1 : 0);
    manifest.println(filename + "," + t.name + "," + t.percentText() + "," + full + "," + partial + "," + blanks + "," + t.reportedN + "," + t.denominator + "," + t.artFile + "," + SOURCE_CSV + "," + SOURCE_DOI + "," + layout);
  }
}

class Technique {
  String name, label, artFile, exportName;
  int tenths, reportedN, denominator;
  PImage art;
  Technique(String name, String label, String artFile, String exportName,
    int tenths, int reportedN, int denominator, PImage art) {
    this.name = name;
    this.label = label;
    this.artFile = artFile;
    this.exportName = exportName;
    this.tenths = tenths;
    this.reportedN = reportedN;
    this.denominator = denominator;
    this.art = art;
  }
  String percentText() { return (tenths / 10) + "." + (tenths % 10); }
}
