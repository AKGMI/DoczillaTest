import java.io.*;
import java.nio.file.*;
import java.util.*;

public class FileConcatenator {
    private static final String REQUIRE_DIRECTIVE = "require";
    private static Path ROOT_DIRECTORY;

    public static void main(String[] args) throws IOException {
        if (args.length > 0) {
            ROOT_DIRECTORY = Paths.get(args[0]);
        } else {
            ROOT_DIRECTORY = Paths.get(System.getProperty("user.dir"), "testDir");
        }

        System.out.println("Starting file scan...");
        List<Path> textFiles = new ArrayList<>();
        Files.walk(ROOT_DIRECTORY)
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().endsWith(".txt"))
                .sorted()
                .forEach(textFiles::add);
        System.out.println("Files found and sorted by name: " + textFiles);

        System.out.println("Analyzing dependencies...");
        Map<String, List<String>> dependencies = new HashMap<>();
        for (Path file : textFiles) {
            List<String> requiredFiles = new ArrayList<>();
            try (BufferedReader reader = Files.newBufferedReader(file)) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.startsWith(REQUIRE_DIRECTIVE)) {
                        String requiredFile = extractRequiredFilePath(line);
                        requiredFiles.add(ROOT_DIRECTORY.resolve(requiredFile).toString());
                    }
                }
            }
            dependencies.put(file.toString(), requiredFiles);
        }

        System.out.println("Building topological order...");
        List<String> sortedFiles;
        try {
            sortedFiles = topologicalSort(dependencies);
        } catch (IllegalStateException e) {
            System.out.println(e.getMessage());
            return;
        }
        System.out.println("Sorted files: " + sortedFiles);

        System.out.println("Concatenating files...");
        try (BufferedWriter writer = Files.newBufferedWriter(ROOT_DIRECTORY.resolve("../output.txt"))) {
            for (String filePath : sortedFiles) {
                Path file = Paths.get(filePath);
                Files.lines(file).forEach(line -> {
                    try {
                        if (!line.startsWith(REQUIRE_DIRECTIVE)) {
                            writer.write(line);
                            writer.newLine();
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
            }
        }

        System.out.println("Process completed. Output file created.");
    }

    private static String extractRequiredFilePath(String line) {
        return line.replace(REQUIRE_DIRECTIVE + " '", "").replace("'", "").trim() + ".txt";
    }

    private static List<String> topologicalSort(Map<String, List<String>> dependencies) {
        Map<String, Boolean> visited = new HashMap<>();
        List<String> sortedList = new ArrayList<>();
        Set<String> recursionStack = new HashSet<>();

        for (String file : dependencies.keySet()) {
            if (dfs(file, dependencies, visited, sortedList, recursionStack)) {
                throw new IllegalStateException("Cyclic dependency detected: " + recursionStack);
            }
        }

        return sortedList;
    }

    private static boolean dfs(String file, Map<String, List<String>> dependencies, Map<String, Boolean> visited, List<String> sortedList, Set<String> recursionStack) {
        if (recursionStack.contains(file)) {
            return true;
        }
        if (Boolean.TRUE.equals(visited.get(file))) {
            return false;
        }

        visited.put(file, true);
        recursionStack.add(file);

        for (String dependency : dependencies.getOrDefault(file, Collections.emptyList())) {
            if (dfs(dependency, dependencies, visited, sortedList, recursionStack)) {
                return true;
            }
        }

        recursionStack.remove(file);
        sortedList.add(file);
        return false;
    }
}
