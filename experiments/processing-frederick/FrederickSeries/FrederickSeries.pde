import java.io.File;
import java.io.PrintWriter;

// Frederick et al. (2018): one dot is one percentage point, not a respondent.
// Temporary test settings. Change these to make further series.
final String SOURCE_FILE = "../../../data/raw/frederick-2018.csv";
final String MEASURE = "usually-always orgasm when sexually intimate during past month";
final String DOI = "10.1007/s10508-017-0939-z";
final String[] NAMES = {
  "heterosexual men", "gay men", "bisexual men",
  "lesbian women", "bisexual women", "heterosexual women"
};
final int[] COLORS = {
  0xFFB3421B, 0xFF146B9C, 0xFF087F5B,
  0xFF97508D, 0xFFA86A00, 0xFF5B60A8
};
final int CANVAS = 1200;
final float DOT_SIZE = 6.4;
final float ROW_STEP = 9.2;
final float FIRST_RING = 140;
final float RING_STEP = 60;

GroupValue[] groups;
File runFolder;
PrintWriter manifest;

void setup() {
  noLoop();
  loadAndValidate();
  openRunFolder();
  try {
    for (int mode = 0; mode < 2; mode++) {
      boolean fixed100 = mode == 1;
      renderAllRows(fixed100);
      renderAllRings(fixed100);
      for (int i = 0; i < groups.length; i++) {
        renderSingleRow(i, fixed100);
        renderSingleRing(i, fixed100);
      }
    }
    renderComparisonSheet();
  } finally {
    manifest.flush();
    manifest.close();
  }
  println("Saved 28 variants, one comparison sheet, and manifest to " + runFolder.getAbsolutePath());
  exit();
}

void draw() {
  // All exports are made once in setup().
}

void loadAndValidate() {
  String path = sketchPath(SOURCE_FILE);
  Table table = loadTable(path, "header");
  if (table == null || table.getRowCount() != NAMES.length) {
    throw new RuntimeException("Expected six rows in " + path);
  }
  groups = new GroupValue[NAMES.length];
  for (int i = 0; i < NAMES.length; i++) {
    TableRow row = table.getRow(i);
    String name = row.getString("group");
    String measure = row.getString("measure");
    String unit = row.getString("unit");
    float value = row.getFloat("value");
    int n = row.getInt("denominator_n");
    if (!NAMES[i].equals(name) || !MEASURE.equals(measure) || !"percent".equals(unit)) {
      throw new RuntimeException("Unexpected group, measure, or unit at row " + (i + 1));
    }
    if (Float.isNaN(value) || value < 0 || value > 100 || value != Math.round(value) || n <= 0) {
      throw new RuntimeException("Invalid whole percentage or denominator for " + name);
    }
    groups[i] = new GroupValue(name, Math.round(value), n, COLORS[i]);
  }
}

void openRunFolder() {
  String stamp = nf(year(), 4) + nf(month(), 2) + nf(day(), 2) + "-" +
    nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  File base = new File(sketchPath("output"));
  runFolder = new File(base, "run-" + stamp);
  int suffix = 2;
  while (runFolder.exists()) {
    runFolder = new File(base, "run-" + stamp + "-" + suffix++);
  }
  if (!runFolder.mkdirs()) {
    throw new RuntimeException("Could not make output folder: " + runFolder);
  }
  manifest = createWriter(new File(runFolder, "manifest.csv").getAbsolutePath());
  manifest.println("filename,count_mode,arrangement,scope,group,percent,denominator_n,source_file,source_doi");
  PrintWriter settings = createWriter(new File(runFolder, "settings.csv").getAbsolutePath());
  settings.println("parameter,value");
  settings.println("canvas_logical_pixels," + CANVAS);
  settings.println("dot_diameter," + DOT_SIZE);
  settings.println("row_step," + ROW_STEP);
  settings.println("first_ring_radius," + FIRST_RING);
  settings.println("ring_step," + RING_STEP);
  settings.println("fixed_100_remainder,outlined dots");
  for (int i = 0; i < groups.length; i++) {
    settings.println("color_" + slug(groups[i].name) + ",#" + hex(groups[i].dotColor, 8));
  }
  settings.flush();
  settings.close();
}

PGraphics page(String subtitle) {
  PGraphics p = createGraphics(CANVAS, CANVAS);
  p.beginDraw();
  p.background(255);
  p.fill(20);
  p.textAlign(LEFT, BASELINE);
  p.textSize(29);
  p.text("Usually or always orgasming when sexually intimate", 48, 65);
  p.textSize(18);
  p.text(subtitle, 48, 98);
  return p;
}

void footer(PGraphics p, boolean fixed100) {
  p.fill(35);
  p.textAlign(LEFT, BASELINE);
  p.textSize(16);
  String encoding = fixed100
    ? "Filled dots show reported percentage; outlined dots complete 100. Dots are not people."
    : "Each dot represents one percentage point, not one respondent.";
  p.text("Past month. " + encoding, 48, 1137);
  p.textSize(14);
  p.text("Frederick et al. (2018), doi:" + DOI + "  |  Self-selected survey; rounded values.", 48, 1165);
}

void drawDot(PGraphics p, GroupValue g, float x, float y, boolean filled) {
  if (filled) {
    p.noStroke();
    p.fill(g.dotColor);
  } else {
    p.noFill();
    p.stroke(g.dotColor);
    p.strokeWeight(1);
  }
  p.ellipse(x, y, DOT_SIZE, DOT_SIZE);
}

void dotsInRow(PGraphics p, GroupValue g, float x, float y, boolean fixed100) {
  int slots = fixed100 ? 100 : g.percent;
  for (int j = 0; j < slots; j++) {
    drawDot(p, g, x + j * ROW_STEP, y, j < g.percent);
  }
}

void dotsInRing(PGraphics p, GroupValue g, float cx, float cy, float radius, boolean fixed100) {
  int slots = fixed100 ? 100 : g.percent;
  for (int j = 0; j < slots; j++) {
    float a = -HALF_PI + TWO_PI * j / slots;
    drawDot(p, g, cx + radius * cos(a), cy + radius * sin(a), j < g.percent);
  }
}

String modeName(boolean fixed100) {
  return fixed100 ? "fixed100" : "variable";
}

String modeLabel(boolean fixed100) {
  return fixed100 ? "100 positions, filled plus outline" : "filled dots only";
}

void renderAllRows(boolean fixed100) {
  PGraphics p = page("All six groups / straight rows / " + modeLabel(fixed100));
  for (int i = 0; i < groups.length; i++) {
    GroupValue g = groups[i];
    float y = 225 + i * 145;
    p.fill(20);
    p.textAlign(LEFT, BASELINE);
    p.textSize(20);
    p.text(g.name + "  " + g.percent + "%", 48, y - 18);
    p.textSize(15);
    p.text("n=" + g.denominator, 48, y + 5);
    dotsInRow(p, g, 270, y, fixed100);
  }
  footer(p, fixed100);
  savePage(p, "all-groups-rows-" + modeName(fixed100) + ".png", fixed100, "straight rows", "all six", -1);
}

void renderAllRings(boolean fixed100) {
  PGraphics p = page("All six groups / concentric rings / " + modeLabel(fixed100));
  for (int i = 0; i < groups.length; i++) {
    dotsInRing(p, groups[i], CANVAS / 2, 550, FIRST_RING + i * RING_STEP, fixed100);
  }
  for (int i = 0; i < groups.length; i++) {
    GroupValue g = groups[i];
    int col = i / 3;
    int row = i % 3;
    float x = 70 + col * 565;
    float y = 1020 + row * 28;
    p.noStroke();
    p.fill(g.dotColor);
    p.ellipse(x, y - 5, 10, 10);
    p.fill(20);
    p.textAlign(LEFT, BASELINE);
    p.textSize(18);
    p.text(g.name + "  " + g.percent + "%  (n=" + g.denominator + ")", x + 17, y);
  }
  footer(p, fixed100);
  savePage(p, "all-groups-rings-" + modeName(fixed100) + ".png", fixed100, "concentric rings", "all six", -1);
}

void renderSingleRow(int i, boolean fixed100) {
  GroupValue g = groups[i];
  PGraphics p = page("Single group / straight row / " + modeLabel(fixed100));
  p.fill(20);
  p.textAlign(CENTER, BASELINE);
  p.textSize(32);
  p.text(g.name + "  " + g.percent + "%", CANVAS / 2, 505);
  p.textSize(19);
  p.text("n=" + g.denominator, CANVAS / 2, 545);
  int slots = fixed100 ? 100 : g.percent;
  dotsInRow(p, g, (CANVAS - (slots - 1) * ROW_STEP) / 2, 620, fixed100);
  footer(p, fixed100);
  savePage(p, slug(g.name) + "-rows-" + modeName(fixed100) + ".png", fixed100, "straight row", "single group", i);
}

void renderSingleRing(int i, boolean fixed100) {
  GroupValue g = groups[i];
  PGraphics p = page("Single group / circular row / " + modeLabel(fixed100));
  dotsInRing(p, g, CANVAS / 2, 590, 310, fixed100);
  p.fill(20);
  p.textAlign(CENTER, BASELINE);
  p.textSize(52);
  p.text(g.percent + "%", CANVAS / 2, 585);
  p.textSize(25);
  p.text(g.name, CANVAS / 2, 630);
  p.textSize(18);
  p.text("n=" + g.denominator, CANVAS / 2, 663);
  footer(p, fixed100);
  savePage(p, slug(g.name) + "-ring-" + modeName(fixed100) + ".png", fixed100, "circular row", "single group", i);
}

void savePage(PGraphics p, String filename, boolean fixed100, String arrangement, String scope, int groupIndex) {
  p.endDraw();
  File file = new File(runFolder, filename);
  p.save(file.getAbsolutePath());
  String group = groupIndex < 0 ? "all six" : groups[groupIndex].name;
  String percent = groupIndex < 0 ? "" : str(groups[groupIndex].percent);
  String n = groupIndex < 0 ? "" : str(groups[groupIndex].denominator);
  manifest.println(filename + "," + modeName(fixed100) + "," + arrangement + "," + scope + "," + group + "," +
    percent + "," + n + "," + SOURCE_FILE + "," + DOI);
}

void renderComparisonSheet() {
  String[] names = {
    "all-groups-rows-variable.png", "all-groups-rows-fixed100.png",
    "all-groups-rings-variable.png", "all-groups-rings-fixed100.png"
  };
  PGraphics p = createGraphics(CANVAS, CANVAS);
  p.beginDraw();
  p.background(255);
  for (int i = 0; i < names.length; i++) {
    PImage source = loadImage(new File(runFolder, names[i]).getAbsolutePath());
    if (source == null) {
      throw new RuntimeException("Could not load comparison image: " + names[i]);
    }
    float x = (i % 2) * (CANVAS / 2);
    float y = (i / 2) * (CANVAS / 2);
    p.image(source, x, y, CANVAS / 2, CANVAS / 2);
  }
  p.endDraw();
  p.save(new File(runFolder, "comparison-sheet.png").getAbsolutePath());
}

String slug(String name) {
  return name.replace(' ', '-');
}

class GroupValue {
  final String name;
  final int percent;
  final int denominator;
  final int dotColor;
  GroupValue(String name, int percent, int denominator, int dotColor) {
    this.name = name;
    this.percent = percent;
    this.denominator = denominator;
    this.dotColor = dotColor;
  }
}
