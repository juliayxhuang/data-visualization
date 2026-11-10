import java.io.File;
import java.io.PrintWriter;

// Two reversible visual tests using Herbenick et al. (2010), Table 3.
// Edit this settings block for later style experiments.
final String SOURCE_CSV = "../../../data/raw/herbenick-2010-age-event-orgasm.csv";
final String SOURCE_URL = "https://doi.org/10.1111/j.1743-6109.2010.02020.x";
final String WOMEN_ART = "../../../story/assets/female.png";
final String MEN_ART = "../../../story/assets/male.png";
final int PAGE_WIDTH = 2400;
final int PAGE_HEIGHT = 1400;
final int PAPER = 0xFFFFFFFF;
final int RED = 0xFFCF0B2E;
final String FONT = "Georgia";
final float AXIS_X = 182;
final float PLOT_TOP = 210;
final float PLOT_BOTTOM = 1090;
final float PAIR_START = 425;
final float PAIR_STEP = 420;
final float PAIR_OFFSET = 79;
final float BAR_WIDTH = 96;
final float VALUE_TICK_LENGTH = 19;
final String[] AGES = {"18-24", "25-29", "30-39", "40-49", "50-59"};
final String[] GROUPS = {"women", "men"};

Table source;
float[][] rates = new float[5][2];
PImage[] art = new PImage[2];
File runFolder;

void setup() {
  noLoop();
  loadData();
  art[0] = loadAndRecolor(WOMEN_ART);
  art[1] = loadAndRecolor(MEN_ART);
  println("Cropped art dimensions: women " + art[0].width + "x" + art[0].height +
    ", men " + art[1].width + "x" + art[1].height);
  makeRunFolder();
  renderBars("age-paired-bars.png");
  renderScaledIllustrations("age-scaled-illustrations.png");
  writeManifest();
  println("Saved both age tests to " + runFolder.getAbsolutePath());
  exit();
}

void draw() { }

void loadData() {
  source = loadTable(sketchPath(SOURCE_CSV), "header");
  if (source == null || source.getRowCount() != 10) throw new RuntimeException("Expected ten source rows");
  for (int i = 0; i < AGES.length; i++) {
    for (int g = 0; g < GROUPS.length; g++) {
      TableRow row = null;
      for (int j = 0; j < source.getRowCount(); j++) {
        TableRow candidate = source.getRow(j);
        if (AGES[i].equals(candidate.getString("age_group")) &&
            GROUPS[g].equals(candidate.getString("study_group"))) row = candidate;
      }
      if (row == null) throw new RuntimeException("Missing " + AGES[i] + " " + GROUPS[g]);
      float v = row.getFloat("orgasm_at_most_recent_partnered_event_percent");
      if (!AGES[i].equals(row.getString("age_group")) ||
          !GROUPS[g].equals(row.getString("study_group")) ||
          !"Table 3".equals(row.getString("source_location")) ||
          Float.isNaN(v) || v < 0 || v > 100) {
        throw new RuntimeException("Unexpected source row for " + AGES[i] + " " + GROUPS[g]);
      }
      rates[i][g] = v;
    }
  }
}

PImage loadAndRecolor(String relativePath) {
  PImage original = loadImage(sketchPath(relativePath));
  if (original == null) throw new RuntimeException("Missing illustration " + relativePath);
  original.loadPixels();
  int left = original.width, top = original.height, right = -1, bottom = -1;
  for (int y = 0; y < original.height; y++) {
    for (int x = 0; x < original.width; x++) {
      int a = (original.pixels[y * original.width + x] >>> 24) & 255;
      if (a > 16) {
        left = min(left, x);
        top = min(top, y);
        right = max(right, x);
        bottom = max(bottom, y);
      }
    }
  }
  if (right < left) throw new RuntimeException("Empty illustration " + relativePath);
  PImage cropped = original.get(left, top, right - left + 1, bottom - top + 1);
  cropped.loadPixels();
  for (int i = 0; i < cropped.pixels.length; i++) {
    int a = (cropped.pixels[i] >>> 24) & 255;
    cropped.pixels[i] = (a << 24) | (RED & 0x00FFFFFF);
  }
  cropped.updatePixels();
  return cropped;
}

void makeRunFolder() {
  String stamp = nf(year(), 4) + nf(month(), 2) + nf(day(), 2) + "-" +
    nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  File base = new File(sketchPath("output"));
  runFolder = new File(base, "run-" + stamp);
  int suffix = 2;
  while (runFolder.exists()) runFolder = new File(base, "run-" + stamp + "-" + suffix++);
  if (!runFolder.mkdirs()) throw new RuntimeException("Could not create " + runFolder);
}

float valueY(float percent) {
  return map(percent, 0, 100, PLOT_BOTTOM, PLOT_TOP);
}

float groupX(int ageIndex, int groupIndex) {
  return PAIR_START + ageIndex * PAIR_STEP + (groupIndex == 0 ? -PAIR_OFFSET : PAIR_OFFSET);
}

void renderBars(String filename) {
  PGraphics p = createGraphics(PAGE_WIDTH, PAGE_HEIGHT);
  p.smooth(8);
  p.beginDraw();
  p.background(PAPER);
  p.textFont(createFont(FONT, 30, true));
  p.fill(RED);
  p.noStroke();
  p.textAlign(LEFT, BASELINE);
  p.textSize(48);
  p.text("Orgasm at the most recent partnered sexual event", 120, 92);
  p.textSize(24);
  p.text("Percentage of respondents in each age group who answered yes", 122, 136);

  // Only the two requested endpoints have numeric axis labels.
  p.stroke(RED);
  p.strokeWeight(2);
  p.line(AXIS_X, PLOT_TOP, AXIS_X, PLOT_BOTTOM);
  p.line(AXIS_X, PLOT_BOTTOM, 2290, PLOT_BOTTOM);
  p.stroke(RED, 55);
  p.strokeWeight(1);
  p.line(AXIS_X, PLOT_TOP, 2290, PLOT_TOP);
  p.noStroke();
  p.fill(RED);
  p.textAlign(RIGHT, CENTER);
  p.textSize(28);
  p.text("100%", AXIS_X - 28, PLOT_TOP);
  p.text("0%", AXIS_X - 28, PLOT_BOTTOM);

  // Each reported percentage gets its own tick on the y axis.
  p.stroke(RED);
  p.strokeWeight(2);
  for (int i = 0; i < AGES.length; i++) {
    for (int g = 0; g < GROUPS.length; g++) {
      float y = valueY(rates[i][g]);
      p.line(AXIS_X - VALUE_TICK_LENGTH, y, AXIS_X + VALUE_TICK_LENGTH, y);
    }
  }

  for (int i = 0; i < AGES.length; i++) {
    for (int g = 0; g < GROUPS.length; g++) {
      float x = groupX(i, g);
      float y = valueY(rates[i][g]);
      p.noStroke();
      p.fill(RED);
      p.rect(x - BAR_WIDTH / 2, y, BAR_WIDTH, PLOT_BOTTOM - y);
      p.textAlign(CENTER, BOTTOM);
      p.textSize(25);
      p.text(nf(rates[i][g], 0, 1) + "%", x, y - 11);
      p.fill(RED);
      p.noStroke();
      p.textAlign(CENTER, TOP);
      p.textSize(22);
      p.text(g == 0 ? "Women" : "Men", x, PLOT_BOTTOM + 17);
    }
    p.textAlign(CENTER, TOP);
    p.textSize(31);
    p.text(AGES[i], PAIR_START + i * PAIR_STEP, PLOT_BOTTOM + 68);
  }
  p.textAlign(LEFT, BASELINE);
  p.textSize(19);
  p.text("Herbenick et al. (2010), Table 3. Weighted U.S. survey; last partnered event; adults 18-59; data collected 2009.", 122, 1294);
  p.text("Groups reflect the study's men/women categories, not heterosexual-only samples. Cross-sectional rates are not individual predictions.", 122, 1328);
  p.endDraw();
  p.save(new File(runFolder, filename).getAbsolutePath());
}

void renderScaledIllustrations(String filename) {
  // A wider and shorter plot lets ten proportionally scaled, uncropped drawings
  // sit on one 0-100 axis without overlapping adjacent age groups.
  final int width = 3600;
  final int height = 1000;
  final float axisX = 105;
  final float top = 220;
  final float bottom = 650;
  final float plotHeight = bottom - top;
  final float firstPair = 450;
  final float pairStep = 680;
  final float pairOffset = 185;
  PGraphics p = createGraphics(width, height);
  p.smooth(8);
  p.beginDraw();
  p.background(PAPER);
  p.textFont(createFont(FONT, 30, true));
  p.fill(RED);
  p.noStroke();
  p.textAlign(LEFT, BASELINE);
  p.textSize(48);
  p.text("Orgasm at the most recent partnered sexual event", 95, 82);
  p.textSize(23);
  p.text("Percentage of respondents in each age group who answered yes", 97, 123);

  p.stroke(RED);
  p.strokeWeight(2);
  p.line(axisX, top, axisX, bottom);
  p.line(axisX, bottom, width - 45, bottom);
  p.stroke(RED, 55);
  p.strokeWeight(1);
  p.line(axisX, top, width - 45, top);
  p.noStroke();
  p.fill(RED);
  p.textAlign(RIGHT, CENTER);
  p.textSize(27);
  p.text("100%", axisX - 17, top);
  p.text("0%", axisX - 17, bottom);

  for (int i = 0; i < AGES.length; i++) {
    for (int g = 0; g < GROUPS.length; g++) {
      float value = rates[i][g];
      float imageHeight = plotHeight * value / 100.0;
      float imageWidth = imageHeight * art[g].width / art[g].height;
      float x = firstPair + i * pairStep + (g == 0 ? -pairOffset : pairOffset);
      float y = bottom - imageHeight;
      p.stroke(RED);
      p.strokeWeight(2);
      p.line(axisX - 13, y, axisX + 13, y);
      p.noStroke();
      p.image(art[g], x - imageWidth / 2, y, imageWidth, imageHeight);
      p.fill(RED);
      p.textAlign(CENTER, BOTTOM);
      p.textSize(26);
      p.text(nf(value, 0, 1) + "%", x, y - 10);
      p.textAlign(CENTER, TOP);
      p.textSize(24);
      p.text(g == 0 ? "Women" : "Men", x, bottom + 17);
    }
    p.textAlign(CENTER, TOP);
    p.textSize(32);
    p.text(AGES[i], firstPair + i * pairStep, bottom + 67);
  }
  p.textAlign(LEFT, BASELINE);
  p.textSize(19);
  p.text("Herbenick et al. (2010), Table 3. Weighted U.S. survey; last partnered event; adults 18-59; data collected 2009.", 95, 912);
  p.text("Full drawing height encodes percentage on a shared 0-100 scale. The study groups are not heterosexual-only samples.", 95, 947);
  p.endDraw();
  p.save(new File(runFolder, filename).getAbsolutePath());
}

void writeManifest() {
  PrintWriter out = createWriter(new File(runFolder, "manifest.csv").getAbsolutePath());
  out.println("variant,source_csv,source_url,illustrations,red,paper,axis_min,axis_max");
  out.println("paired_bars," + SOURCE_CSV + "," + SOURCE_URL + ",none,#CF0B2E,#FFFFFF,0,100");
  out.println("scaled_illustrations," + SOURCE_CSV + "," + SOURCE_URL + ",story/assets/female.png + story/assets/male.png,#CF0B2E,#FFFFFF,0,100");
  out.flush();
  out.close();
}
