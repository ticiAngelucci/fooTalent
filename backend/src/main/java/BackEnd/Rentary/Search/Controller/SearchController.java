package BackEnd.Rentary.Search.Controller;

import BackEnd.Rentary.Search.Service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    @Autowired
    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> search(@RequestParam("term") String term,
                                                      @RequestParam(value = "entityType", required = false) String entityType) {
        Map<String, Object> result = searchService.search(term, entityType);
        return ResponseEntity.ok(result);
    }
}
