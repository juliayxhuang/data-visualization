import java.io.File;
import java.io.PrintWriter;

// Hensel et al. (2021), Table 6. Values are overlapping percentages reporting
// ever using a technique to orgasm more often OR have more pleasurable sex.
final String SOURCE_CSV = "../../../data/raw/hensel-2021-pairing.csv";
final String SOURCE_DOI = "10.1371/journal.pone.0249242";
final int CANVAS_WIDTH = 1700;
final int CANVAS_HEIGHT = 760;
final float ART_BOX_AREA = 36000;

final String[] TECHNIQUES = {
  "Solo Pairing with a finger", "Solo Pairing with a sex toy",
  "Partner Pairing with a finger", "Partner Pairing with a sex toy"
};
final String[] LABELS = {
  "Self-applied finger", "Self-applied toy",
  "Partner-applied finger", "Partner-applied toy"
};
final String[] ART_FILES = {
  "IMG_1744.PNG", "IMG_1731.PNG", "IMG_1744.PNG", "IMG_1732.PNG"
};

Technique[] items;
File runFolder;

void setup() {
  noLoop();
  loadAndValidate();
  makeRunFolder();
  renderComparison();
  println("Saved landscape comparison to " + runFolder.getAbsolutePath());
  exit();
}

void draw() { }

void loadAndValidate() {
  Table table = loadTable(sketchPath(SOURCE_CSV), "header");
  if (table == null || table.getRowCount() != 7) {
    throw new RuntimeException("Expected seven source rows in " + SOURCE_CSV);
  }
  items = new Technique[TECHNIQUES.length];
  for (int i = 0; i < items.length; i++) {
    int rowIndex = -1;
    for (int j = 0; j < table.getRowCount(); j++) {
      if (TECHNIQUES[i].equals(table.getString(j, "technique"))) rowIndex = j;
    }
    if (rowIndex < 0) throw new RuntimeException("Missing " + TECHNIQUES[i]);
    float percent = table.getFloat(rowIndex, "weighted_percent");
    int denominator = table.getInt(rowIndex, "table_denominator_n");
    if (percent <= 0 || percent > 100 || abs(percent * 10 - round(percent * 10)) > 0.001 || denominator != 2877) {
      throw new RuntimeException("Invalid source value for " + TECHNIQUES[i]);
    }
    PImage original = loadImage("data/" + ART_FILES[i]);
    if (original == null) throw new RuntimeException("Missing illustration " + ART_FILES[i]);
    items[i] = new Technique(TECHNIQUES[i], LABELS[i], ART_FILES[i], round(percent * 10),
      denominator, redInk(trimTransparent(original)));
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
  if (right < left) throw new RuntimeException("Empty illustration");
  return image.get(left, top, right - left + 1, bottom - top + 1);
}

PImage redInk(PImage image) {
  image.loadPixels();
  for (int i = 0; i < image.pixels.length; i++) {
    int a = (image.pixels[i] >>> 24) & 255;
    image.pixels[i] = (a << 24) | (207 << 16) | (11 << 8) | 46;
  }
  image.updatePixels();
  return image;
}

void makeRunFolder() {
  String stamp = nf(year(), 4) + nf(month(), 2) + nf(day(), 2) + "-" +
    nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  File base = new File(sketchPath("output"));
  runFolder = new File(base, "run-" + stamp);
  int suffix = 2;
  while (runFolder.exists()) runFolder = new File(base, "run-" + stamp + "-" + suffix++);
  if (!runFolder.mkdirs()) throw new RuntimeException("Cannot create " + runFolder);
}

void renderComparison() {
  // All cropped drawings have equal rectangular bounds area. The numbers,
  // rather than artwork size, communicate the four percentages.
  PGraphics page = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
  page.beginDraw();
  page.background(255);
  page.fill(207, 11, 46);
  page.noStroke();
  PFont serif = createFont("Georgia", 38, true);
  page.textFont(serif);
  page.textAlign(CENTER, BASELINE);
  page.textSize(38);
  page.text("Have you ever used clitoral touch during vaginal penetration", CANVAS_WIDTH / 2, 69);
  page.text("to orgasm more often or make sex more pleasurable", CANVAS_WIDTH / 2, 113);
  page.text("than penetration alone?", CANVAS_WIDTH / 2, 157);
  page.textSize(21);
  page.text("Share of women who answered yes to each technique", CANVAS_WIDTH / 2, 201);

  PrintWriter manifest = createWriter(new File(runFolder, "manifest.csv").getAbsolutePath());
  manifest.println("technique,weighted_percent,table_denominator_n,art_file,trimmed_width_px,trimmed_height_px,drawn_width_logical_px,drawn_height_logical_px,drawn_bbox_area_logical_px2,source_csv,source_doi");
  for (int i = 0; i < items.length; i++) {
    Technique t = items[i];
    float factor = sqrt(ART_BOX_AREA / (t.art.width * t.art.height));
    float drawWidth = t.art.width * factor;
    float drawHeight = t.art.height * factor;
    float centerX = 235 + i * 410;
    float centerY = 400;
    page.textAlign(CENTER, BASELINE);
    page.image(t.art, centerX - drawWidth / 2, centerY - drawHeight / 2, drawWidth, drawHeight);
    page.textSize(26);
    page.text(t.label, centerX, 604);
    page.textSize(42);
    page.text(t.percentText() + "%", centerX, 652);
    manifest.println(t.name + "," + t.percentText() + "," + t.denominator + "," + t.artFile + "," +
      t.art.width + "," + t.art.height + "," + nf(drawWidth, 0, 3) + "," +
      nf(drawHeight, 0, 3) + "," + nf(drawWidth * drawHeight, 0, 3) + "," +
      SOURCE_CSV + "," + SOURCE_DOI);
  }
  page.textAlign(CENTER, BASELINE);
  page.fill(207, 11, 46);
  page.textSize(17);
  page.text("Techniques overlap; percentages cannot be added. Illustration sizes are equal, not scaled to the percentages.", CANVAS_WIDTH / 2, 704);
  page.textSize(15);
  page.text("Hensel et al. (2021), Table 6  |  Weighted U.S. women survey, N=2,877  |  doi:" + SOURCE_DOI, CANVAS_WIDTH / 2, 733);
  page.endDraw();
  page.save(new File(runFolder, "four-techniques-landscape.png").getAbsolutePath());
  manifest.flush();
  manifest.close();
}

class Technique {
  String name, label, artFile;
  int tenths, denominator;
  PImage art;
  Technique(String name, String label, String artFile, int tenths, int denominator, PImage art) {
    this.name = name;
    this.label = label;
    this.artFile = artFile;
    this.tenths = tenths;
    this.denominator = denominator;
    this.art = art;
  }
  String percentText() { return (tenths / 10) + "." + (tenths % 10); }
}
