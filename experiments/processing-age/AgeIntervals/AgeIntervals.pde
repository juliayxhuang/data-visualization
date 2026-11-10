import java.io.File;
import java.io.PrintWriter;
import java.util.Locale;

// Gesselman et al. (2024), Table 3: adjusted gender coefficients within age bands.
// Change this block to test styling. The data and its provenance stay in the CSV.
final String SOURCE_FILE = "../../../data/raw/gesselman-2024-age-model.csv";
final String SOURCE_URL = "https://doi.org/10.1093/sexmed/qfae042";
final int CANVAS_WIDTH = 1600;
final int CANVAS_HEIGHT = 900;
final int PAPER_COLOR = 0xFFFFFFFF;
final int INK_COLOR = 0xFFCF0B2E; // Same red as story/styles.css.
final String FONT_NAME = "Georgia"; // Temporary system serif.
final float SCALE_MIN = -30;
final float SCALE_MAX = 0;
final float AXIS_LEFT = 390;
final float AXIS_RIGHT = 1350;
final float FIRST_ROW_Y = 270;
final float ROW_GAP = 106;
final float INTERVAL_WEIGHT = 2;
final float ESTIMATE_DIAMETER = 20;
final float AXIS_WEIGHT = 1;
final int TITLE_SIZE = 51;
final int SUBTITLE_SIZE = 23;
final int AGE_LABEL_SIZE = 31;
final int VALUE_LABEL_SIZE = 28;
final int AXIS_LABEL_SIZE = 21;
final int NOTE_SIZE = 18;
final int SOURCE_SIZE = 16;
final boolean SHOW_INTERVALS = true;

final String[] AGE_GROUPS = { "18-24", "25-34", "35-49", "50-64", "65+" };
Table data;
File runFolder;

void setup() {
  noLoop();
  loadAndValidate();
  openRunFolder();
  PGraphics page = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
  drawPage(page);
  String filename = "age-adjusted-gender-intervals.png";
  page.save(new File(runFolder, filename).getAbsolutePath());
  writeManifest(filename);
  writeSettings();
  println("Saved " + filename + " to " + runFolder.getAbsolutePath());
  exit();
}

void loadAndValidate() {
  data = loadTable(sketchPath(SOURCE_FILE), "header");
  if (data == null || data.getRowCount() != AGE_GROUPS.length) {
    throw new RuntimeException("Expected five age-band rows in " + SOURCE_FILE);
  }
  for (int i = 0; i < AGE_GROUPS.length; i++) {
    TableRow row = data.getRow(i);
    float estimate = row.getFloat("coefficient_b");
    float lower = row.getFloat("ci_lower_95");
    float upper = row.getFloat("ci_upper_95");
    if (!AGE_GROUPS[i].equals(row.getString("age_group")) ||
        !"gender women vs men".equals(row.getString("model_term")) ||
        !"Table 3".equals(row.getString("source_location")) ||
        Float.isNaN(estimate) || Float.isNaN(lower) || Float.isNaN(upper) ||
        lower >= estimate || estimate >= upper ||
        lower < SCALE_MIN || upper > SCALE_MAX) {
      throw new RuntimeException("Unexpected age-model row " + (i + 1));
    }
  }
}

void openRunFolder() {
  String stamp = nf(year(), 4) + nf(month(), 2) + nf(day(), 2) + "-" +
    nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  File output = new File(sketchPath("output"));
  runFolder = new File(output, "run-" + stamp);
  int suffix = 2;
  while (runFolder.exists()) runFolder = new File(output, "run-" + stamp + "-" + suffix++);
  if (!runFolder.mkdirs()) throw new RuntimeException("Could not create " + runFolder);
}

float positionFor(float coefficient) {
  return map(coefficient, SCALE_MIN, SCALE_MAX, AXIS_LEFT, AXIS_RIGHT);
}

String valueLabel(float value) {
  return String.format(Locale.US, "%.2f", value);
}

void drawPage(PGraphics page) {
  page.smooth(8);
  page.beginDraw();
  page.background(PAPER_COLOR);
  page.textFont(createFont(FONT_NAME, 30, true));
  page.fill(INK_COLOR);
  page.noStroke();
  page.textAlign(LEFT, BASELINE);
  page.textSize(TITLE_SIZE);
  page.text("Gender coefficient across age groups", 80, 93);
  page.textSize(SUBTITLE_SIZE);
  page.text("Women vs men / adjusted model of self-estimated orgasm rate during intercourse", 80, 139);

  page.textSize(AXIS_LABEL_SIZE);
  for (int tick = -30; tick <= 0; tick += 10) {
    float x = positionFor(tick);
    page.stroke(INK_COLOR, 110);
    page.strokeWeight(AXIS_WEIGHT);
    page.line(x, 190, x, 712);
    page.noStroke();
    page.textAlign(CENTER, BASELINE);
    page.text(tick, x, 743);
  }

  for (int i = 0; i < AGE_GROUPS.length; i++) {
    TableRow row = data.getRow(i);
    float y = FIRST_ROW_Y + i * ROW_GAP;
    float estimate = row.getFloat("coefficient_b");
    float lower = row.getFloat("ci_lower_95");
    float upper = row.getFloat("ci_upper_95");

    page.fill(INK_COLOR);
    page.noStroke();
    page.textAlign(LEFT, CENTER);
    page.textSize(AGE_LABEL_SIZE);
    page.text(AGE_GROUPS[i], 80, y);
    if (SHOW_INTERVALS) {
      page.stroke(INK_COLOR);
      page.strokeWeight(INTERVAL_WEIGHT);
      page.line(positionFor(lower), y, positionFor(upper), y);
      page.line(positionFor(lower), y - 10, positionFor(lower), y + 10);
      page.line(positionFor(upper), y - 10, positionFor(upper), y + 10);
    }
    page.noStroke();
    page.fill(INK_COLOR);
    page.ellipse(positionFor(estimate), y, ESTIMATE_DIAMETER, ESTIMATE_DIAMETER);
    page.textAlign(RIGHT, CENTER);
    page.textSize(VALUE_LABEL_SIZE);
    page.text(valueLabel(estimate), 1515, y);
  }

  page.fill(INK_COLOR);
  page.textAlign(LEFT, BASELINE);
  page.textSize(NOTE_SIZE);
  page.text("Thin line = published 95% CI; dot = adjusted coefficient. Values are model points, not age-group orgasm rates.", 80, 813);
  page.textSize(SOURCE_SIZE);
  page.text("Gesselman et al. (2024), Table 3. Cross-sectional sample; 35-49 CI appears asymmetric as printed.", 80, 851);
  page.endDraw();
}

void writeManifest(String filename) {
  PrintWriter out = createWriter(new File(runFolder, "manifest.csv").getAbsolutePath());
  out.println("filename,age_group,model_term,coefficient_b,ci_lower_95,ci_upper_95,source_file,source_url");
  for (int i = 0; i < AGE_GROUPS.length; i++) {
    TableRow row = data.getRow(i);
    out.println(filename + "," + AGE_GROUPS[i] + "," + row.getString("model_term") + "," +
      row.getString("coefficient_b") + "," + row.getString("ci_lower_95") + "," +
      row.getString("ci_upper_95") + "," + SOURCE_FILE + "," + SOURCE_URL);
  }
  out.flush();
  out.close();
}

void writeSettings() {
  PrintWriter out = createWriter(new File(runFolder, "settings.csv").getAbsolutePath());
  out.println("parameter,value");
  out.println("canvas_width," + CANVAS_WIDTH);
  out.println("canvas_height," + CANVAS_HEIGHT);
  out.println("paper_color,#" + hex(PAPER_COLOR, 8));
  out.println("ink_color,#" + hex(INK_COLOR, 8));
  out.println("font_name," + FONT_NAME);
  out.println("scale_min," + SCALE_MIN);
  out.println("scale_max," + SCALE_MAX);
  out.println("interval_weight," + INTERVAL_WEIGHT);
  out.println("estimate_diameter," + ESTIMATE_DIAMETER);
  out.println("title_size," + TITLE_SIZE);
  out.println("subtitle_size," + SUBTITLE_SIZE);
  out.println("age_label_size," + AGE_LABEL_SIZE);
  out.println("value_label_size," + VALUE_LABEL_SIZE);
  out.println("axis_label_size," + AXIS_LABEL_SIZE);
  out.println("note_size," + NOTE_SIZE);
  out.println("source_size," + SOURCE_SIZE);
  out.println("show_intervals," + SHOW_INTERVALS);
  out.flush();
  out.close();
}
